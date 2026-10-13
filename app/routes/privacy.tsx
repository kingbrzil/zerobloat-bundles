import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy - ZeroBloat Bundles" },
    { name: "description", content: "Privacy policy for ZeroBloat Bundles Shopify App" },
  ];
};

export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", maxWidth: "800px", margin: "40px auto", padding: "0 20px", color: "#0f172a", lineHeight: "1.6" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>Privacy Policy - ZeroBloat Bundles</h1>
      <p style={{ color: "#64748b", marginBottom: "32px" }}>Last updated: October 2026</p>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>1. Overview</h2>
        <p>ZeroBloat Bundles ("the App", "we", "our") provides tiered volume discount and product bundle features for merchants using Shopify. We are committed to protecting merchant and customer privacy.</p>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>2. Information We Collect</h2>
        <p>When you install ZeroBloat Bundles, we automatically access certain information from your Shopify store necessary for the app to function:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li><strong>Shop Information:</strong> Your shop myshopify.com domain and store name to manage your app installation.</li>
          <li><strong>Product Catalog:</strong> Product titles, variant options, pricing, and image URLs to render bundle widgets on your product pages.</li>
          <li><strong>Discount Configurations:</strong> Rules you create for volume tiers and mix & match bundles.</li>
        </ul>
        <p style={{ marginTop: "12px" }}><strong>Customer Data Protection:</strong> We DO NOT collect, store, sell, or share any personal identifying information (PII) of your store's end customers. We do not access customer names, email addresses, phone numbers, shipping addresses, or payment card details. All transactions are securely handled directly by Shopify.</p>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>3. How We Use Information</h2>
        <p>We use the collected store data exclusively to:</p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>Render bundle widgets via Shopify Online Store 2.0 Theme App Extensions.</li>
          <li>Execute WebAssembly discount calculation functions at checkout.</li>
          <li>Provide customer support upon request.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>4. Data Retention and Uninstallation</h2>
        <p>Upon uninstallation of the app from your Shopify store, all store access tokens are revoked immediately via Shopify webhooks, and your session data is deleted. Because our widgets are Theme App Extensions, uninstalling leaves zero leftover scripts in your store theme.</p>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>5. Contact Us</h2>
        <p>If you have questions about this privacy policy, please contact us at: <a href="mailto:jonhasexc@gmail.com" style={{ color: "#10b981" }}>jonhasexc@gmail.com</a></p>
      </section>
    </div>
  );
}
