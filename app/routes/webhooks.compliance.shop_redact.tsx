import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  console.log(`[Compliance] Received ${topic} for ${shop}`);
  
  if (shop) {
    await db.session.deleteMany({ where: { shop } });
  }
  
  return new Response();
};
