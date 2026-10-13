import type {
  RunInput,
  FunctionRunResult,
  Target,
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

export function run(input: RunInput): FunctionRunResult {
  const lines = input?.cart?.lines;
  if (!lines || lines.length === 0) {
    return EMPTY_DISCOUNT;
  }

  // Group line IDs by their discount percentage
  const discountsByPercent = new Map<number, string[]>();

  for (const line of lines) {
    let discountVal: number | null = null;

    // 1. Check if line has explicit bundle discount attribute (e.g. "_bundle_discount": "15%")
    if (line.attribute?.value) {
      const parsed = parseFloat(line.attribute.value.replace('%', '').trim());
      if (!isNaN(parsed) && parsed > 0) {
        discountVal = parsed;
      }
    }

    if (discountVal !== null && discountVal > 0) {
      const existing = discountsByPercent.get(discountVal) || [];
      existing.push(line.id);
      discountsByPercent.set(discountVal, existing);
    }
  }

  // 2. Automatic quantity break fallback:
  // If no _bundle_discount attributes exist, but customer purchased quantity >= 2 of the same product
  if (discountsByPercent.size === 0) {
    const productQuantities = new Map<string, { totalQty: number; lineIds: string[] }>();

    for (const line of lines) {
      if (line.merchandise.__typename === 'ProductVariant') {
        const prodId = line.merchandise.product.id;
        const entry = productQuantities.get(prodId) || { totalQty: 0, lineIds: [] };
        entry.totalQty += line.quantity;
        entry.lineIds.push(line.id);
        productQuantities.set(prodId, entry);
      }
    }

    for (const [, { totalQty, lineIds }] of productQuantities.entries()) {
      if (totalQty >= 3) {
        const existing = discountsByPercent.get(25) || [];
        existing.push(...lineIds);
        discountsByPercent.set(25, existing);
      } else if (totalQty === 2) {
        const existing = discountsByPercent.get(15) || [];
        existing.push(...lineIds);
        discountsByPercent.set(15, existing);
      }
    }
  }

  if (discountsByPercent.size === 0) {
    return EMPTY_DISCOUNT;
  }

  const discounts = [];

  for (const [percent, lineIds] of discountsByPercent.entries()) {
    const targets: Target[] = lineIds.map((id) => ({
      cartLine: {
        id: id,
      },
    }));

    discounts.push({
      targets: targets,
      value: {
        percentage: {
          value: percent.toString(),
        },
      },
      message: `ZeroBloat Bundle (${percent}% OFF)`,
    });
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.All,
    discounts: discounts,
  };
}