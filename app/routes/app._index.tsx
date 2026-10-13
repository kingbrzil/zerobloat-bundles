import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  Box,
  Banner,
  Badge,
  Divider,
  List,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session, billing } = await authenticate.admin(request);

  let isPro = false;
  try {
    const billingCheck = await billing.check({
      plans: [MONTHLY_PLAN],
      isTest: true,
    });
    isPro = !!billingCheck?.hasActivePayment;
  } catch (err) {
    console.log("[ZeroBloat] Billing check:", err);
  }

  let functionId: string | null = null;
  let hasDiscountActive = false;
  let discountTitle = "";

  try {
    // 1. Fetch registered functions
    const fnResponse = await admin.graphql(
      `#graphql
      query getFunctions {
        shopifyFunctions(first: 25) {
          nodes {
            id
            title
            apiType
          }
        }
      }`
    );
    const fnJson = await fnResponse.json();
    const functions = fnJson?.data?.shopifyFunctions?.nodes || [];
    const discountFn = functions.find(
      (f: any) =>
        f.apiType === "product_discounts" ||
        f.title?.toLowerCase().includes("zerobloat") ||
        f.title?.toLowerCase().includes("discount")
    );

    if (discountFn) {
      functionId = discountFn.id;
    }

    // 2. Fetch existing automatic app discounts
    const discountResponse = await admin.graphql(
      `#graphql
      query getDiscounts {
        discountNodes(first: 25) {
          nodes {
            id
            discount {
              __typename
              ... on DiscountAutomaticApp {
                title
                status
              }
            }
          }
        }
      }`
    );
    const discJson = await discountResponse.json();
    const discountNodes = discJson?.data?.discountNodes?.nodes || [];

    for (const node of discountNodes) {
      if (node.discount?.__typename === "DiscountAutomaticApp") {
        if (
          node.discount.title?.includes("ZeroBloat") ||
          node.discount.status === "ACTIVE"
        ) {
          hasDiscountActive = true;
          discountTitle = node.discount.title;
          break;
        }
      }
    }
  } catch (err) {
    console.error("[ZeroBloat] Error querying functions or discounts:", err);
  }

  return json({
    shop: session.shop,
    functionId,
    hasDiscountActive,
    discountTitle,
    isPro,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session, billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "upgrade_pro") {
    try {
      return await billing.request({
        plan: MONTHLY_PLAN,
        isTest: true,
        returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/app`,
      });
    } catch (err: any) {
      return json({ success: false, error: err.message });
    }
  }

  const functionId = formData.get("functionId") as string;

  if (!functionId) {
    return json({ success: false, error: "Function ID not found" }, { status: 400 });
  }

  try {
    const createResponse = await admin.graphql(
      `#graphql
      mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $discount) {
          automaticAppDiscount {
            discountId
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          discount: {
            title: "ZeroBloat Bundle Automatic Discount",
            functionId: functionId,
            startsAt: new Date().toISOString(),
          },
        },
      }
    );

    const result = await createResponse.json();
    const userErrors = result?.data?.discountAutomaticAppCreate?.userErrors;

    if (userErrors && userErrors.length > 0) {
      return json({ success: false, error: userErrors[0].message });
    }

    return json({
      success: true,
      discount: result?.data?.discountAutomaticAppCreate?.automaticAppDiscount,
    });
  } catch (err: any) {
    return json({ success: false, error: err.message });
  }
};

export default function Index() {
  const { shop, functionId, hasDiscountActive, discountTitle, isPro } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isActivating = navigation.state === "submitting" && !navigation.formData?.get("intent");
  const isUpgrading = navigation.state === "submitting" && navigation.formData?.get("intent") === "upgrade_pro";

  const themeEditorUrl = `https://${shop}/admin/themes/current/editor?context=apps`;

  const handleActivateDiscount = () => {
    if (!functionId) return;
    const form = new FormData();
    form.append("functionId", functionId);
    submit(form, { method: "post" });
  };

  const handleUpgradePro = () => {
    const form = new FormData();
    form.append("intent", "upgrade_pro");
    submit(form, { method: "post" });
  };

  const isDiscountActiveNow = hasDiscountActive || actionData?.success;

  return (
    <Page>
      <TitleBar title="ZeroBloat Bundles">
        <button
          variant="primary"
          onClick={() => window.open(themeEditorUrl, "_blank")}
        >
          Open Theme Editor
        </button>
      </TitleBar>

      <BlockStack gap="500">
        <Banner
          title="ZeroBloat Bundles is active on your store"
          tone="success"
        >
          <p>
            Your store is powered by <strong>Zero Bloat</strong> architecture.
            Both widgets are native to Online Store 2.0 (Theme App Blocks), weighing under
            10KB with zero external server dependencies on product pages.
          </p>
        </Banner>

        {/* Real Checkout Discount Function Status */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text as="h2" variant="headingMd">
                Checkout Discount Engine (Shopify Function)
              </Text>
              {isDiscountActiveNow ? (
                <Badge tone="success">Active in Checkout</Badge>
              ) : (
                <Badge tone="attention">Activation Required</Badge>
              )}
            </InlineStack>

            <Text as="p" variant="bodyMd">
              Discounts are calculated at checkout natively using WebAssembly (WASM) via the Shopify Product Discount API. 
              Zero server latency, instant cart calculation.
            </Text>

            {isDiscountActiveNow ? (
              <Box padding="300" background="bg-surface-success" borderRadius="200">
                <InlineStack align="space-between">
                  <Text as="p" variant="bodySm" fontWeight="bold">
                    ✓ {discountTitle || "ZeroBloat Bundle Automatic Discount"} is active
                  </Text>
                  <Text as="p" variant="bodySm">
                    Volume & Mix-Match discounts apply automatically at checkout.
                  </Text>
                </InlineStack>
              </Box>
            ) : (
              <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                <BlockStack gap="300">
                  <Text as="p" variant="bodySm">
                    Click below to register the WebAssembly discount function on your store so bundle discounts apply at checkout.
                  </Text>
                  <Button
                    variant="primary"
                    onClick={handleActivateDiscount}
                    loading={isActivating}
                    disabled={!functionId}
                  >
                    Activate Checkout Discounts Now
                  </Button>
                </BlockStack>
              </Box>
            )}

            {actionData?.error && (
              <Banner tone="critical">
                <p>{actionData.error}</p>
              </Banner>
            )}
          </BlockStack>
        </Card>

        <Layout>
          {/* Main Column */}
          <Layout.Section>
            <BlockStack gap="500">
              {/* Bundle Types Card */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Available Bundle Modes
                    </Text>
                    <Badge tone="info">OS 2.0 Native</Badge>
                  </InlineStack>

                  <Text as="p" variant="bodyMd">
                    ZeroBloat includes two native app blocks ready to add to any product page template in your Theme Editor:
                  </Text>

                  {/* Feature 1: Volume Discount */}
                  <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">
                          1. Tiered Volume Discounts (Quantity Breaks)
                        </Text>
                        <Badge tone="success">Included in Free</Badge>
                      </InlineStack>
                      <Text as="p" variant="bodySm">
                        Same product in packs of 1x, 2x, or 3x. Automatically renders individual size and color selectors per item. Ideal for apparel, cosmetics, and supplements.
                      </Text>
                    </BlockStack>
                  </Box>

                  {/* Feature 2: Mix & Match PRO */}
                  <Box padding="300" background="bg-surface-secondary" borderRadius="200" borderWidth="025" borderColor="border-inverse">
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">
                          2. Mix & Match / Cross-Sell (Frequently Bought Together)
                        </Text>
                        <Badge tone="attention">PRO</Badge>
                      </InlineStack>
                      <Text as="p" variant="bodySm">
                        Combine different products into one bundle (e.g., Hoodie + Jogger Pants + Cap, or Shampoo + Conditioner). Merchant picks complementary products right in the block, and customers get an instant bundle discount.
                      </Text>
                    </BlockStack>
                  </Box>

                  <InlineStack gap="300">
                    <Button
                      variant="primary"
                      url={themeEditorUrl}
                      target="_blank"
                    >
                      Open Theme Editor
                    </Button>
                    <Button
                      url={`https://${shop}/admin/products`}
                      target="_blank"
                    >
                      View Store Products
                    </Button>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Instructions for Mix & Match PRO */}
              <Card>
                <BlockStack gap="400">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      How to Add Mix & Match (PRO) to Your Theme
                    </Text>
                    <Badge tone="attention">Theme Block</Badge>
                  </InlineStack>

                  <List type="number">
                    <List.Item>
                      Open your <strong>Theme Editor</strong> on any Product page template.
                    </List.Item>
                    <List.Item>
                      Under <strong>Product Information</strong>, click <strong>Add block</strong>.
                    </List.Item>
                    <List.Item>
                      Select <strong>ZeroBloat Mix & Match (PRO)</strong> under the Apps tab.
                    </List.Item>
                    <List.Item>
                      In the block settings, pick up to 4 complementary products using the product picker.
                    </List.Item>
                    <List.Item>
                      Set your bundle discount percentage (e.g., 20% OFF) and hit <strong>Save</strong>.
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>

              {/* ZeroBloat Value Props vs Competitors */}
              <Card>
                <BlockStack gap="400">
                  <Text as="h2" variant="headingMd">
                    Why ZeroBloat Beats Competitors
                  </Text>
                  <Divider />

                  <InlineStack gap="400" wrap={false}>
                    <Box
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                      minWidth="30%"
                    >
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingSm">
                          Ultra-Fast (&lt; 10KB)
                        </Text>
                        <Text as="p" variant="bodySm">
                          Pure Vanilla JS & CSS. Never slows down your PageSpeed or hurts Google SEO ranking.
                        </Text>
                      </BlockStack>
                    </Box>

                    <Box
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                      minWidth="30%"
                    >
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingSm">
                          Native Cart API
                        </Text>
                        <Text as="p" variant="bodySm">
                          Pushes items directly to the native cart drawer without hidden variants or draft orders.
                        </Text>
                      </BlockStack>
                    </Box>

                    <Box
                      padding="300"
                      background="bg-surface-secondary"
                      borderRadius="200"
                      minWidth="30%"
                    >
                      <BlockStack gap="200">
                        <Text as="h3" variant="headingSm">
                          Clean Uninstall
                        </Text>
                        <Text as="p" variant="bodySm">
                          Built on Online Store 2.0. Leaves zero residual code or broken scripts in theme.liquid.
                        </Text>
                      </BlockStack>
                    </Box>
                  </InlineStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar */}
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              {/* Plan Card */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Your Current Plan
                  </Text>
                  {isPro ? (
                    <>
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyLg" fontWeight="bold">
                          ZeroBloat Pro
                        </Text>
                        <Badge tone="success">PRO ACTIVE ($6.90/mo)</Badge>
                      </InlineStack>
                      <Text as="p" variant="bodySm">
                        You have full access to <strong>Mix & Match Bundles</strong>, unlimited tiers, urgency timers, and WebAssembly checkout discounts.
                      </Text>
                    </>
                  ) : (
                    <>
                      <InlineStack align="space-between">
                        <Text as="p" variant="bodyLg" fontWeight="bold">
                          ZeroBloat Starter
                        </Text>
                        <Badge tone="info">FREE</Badge>
                      </InlineStack>
                      <Text as="p" variant="bodySm">
                        Includes Volume Discount bundles on unlimited products.
                      </Text>
                      <Divider />
                      <BlockStack gap="200">
                        <Text as="p" variant="bodyMd" fontWeight="bold">
                          Upgrade to Pro ($6.90/mo):
                        </Text>
                        <Text as="p" variant="bodySm">
                          ✓ Unlock <strong>Mix & Match Cross-Sell Bundles</strong>
                          <br />
                          ✓ Progressive multi-tier volume packages
                          <br />
                          ✓ Urgency Countdown Timer (Evergreen & Fixed)
                          <br />
                          ✓ 7-Day Free Trial included
                        </Text>
                      </BlockStack>
                      <Button
                        variant="primary"
                        fullWidth
                        loading={isUpgrading}
                        onClick={handleUpgradePro}
                      >
                        Upgrade to Pro ($6.90/mo)
                      </Button>
                    </>
                  )}
                </BlockStack>
              </Card>

              {/* Help & Support */}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Need Help?
                  </Text>
                  <Text as="p" variant="bodySm">
                    Have questions about configuring bundles or styling the widget to match your store?
                  </Text>
                  <Button
                    url="mailto:support@zerobloat.com"
                    target="_blank"
                    fullWidth
                  >
                    Contact Support
                  </Button>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
