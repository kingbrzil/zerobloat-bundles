# 🚀 ZeroBloat Bundles - Shopify App Store Listing & Marketing Copy

Este documento contém todo o material de marketing, listagem da App Store, copy de conversão, política de privacidade e instruções de submissão do **ZeroBloat Bundles** prontos para copiar e colar no Shopify Partner Dashboard.

---

## 📌 1. Informações Básicas da App Store (App Listing Basics)

* **App Name (Título do App):**  
  `ZeroBloat Bundles & Cross-Sell`
  *(Otimizado para ASO - busca orgânica por "bundles", "cross-sell" e "volume discounts")*

* **App Subtitle (Subtítulo - máx. 100 caracteres):**  
  `Ultra-fast volume discounts, Mix & Match kits & countdown timers. Zero theme bloat.`

* **App Icon:**  
  Utilize o arquivo gerado e pronto: `app-icon.png` (1200 × 1200 px, 92 KB, otimizado).

* **Categories (Categorias da App Store):**  
  1. *Marketing & Conversion* > *Upgrades & Bundles*  
  2. *Sales & Conversion Optimization* > *Discounts & Gifts*

---

## 💎 2. Destaques & Principais Benefícios (Key Features Bullet Points)

- **⚡ Blazing Fast (< 4KB Frontend):** Pure Vanilla JS engine. Loads in under 15ms. Zero jQuery, zero heavy React bundles on your storefront.
- **📦 Tiered Volume Pricing (1 to 6 Tiers):** Let customers buy 2, 3, 4, 5, or 6+ units with progressive percentage discounts and custom badges.
- **🧩 Mix & Match / Frequently Bought Together:** Bundle complementary products with interactive checkboxes, variant selectors, and tiered savings.
- **⏳ Urgency Countdown Timers:** Drive impulse buys with Evergreen per-visitor session timers (FOMO) or Fixed Campaign End Dates (Black Friday / flash sales).
- **🛡️ 100% Native Shopify Functions:** Discounts calculated natively at checkout via Rust/WebAssembly. Zero draft orders, zero fake variant duplicates.
- **🎨 Deep Theme Customizer Integration:** 100% controllable from your Shopify Theme Editor. Customize colors, borders, typography, and translations with 1-click.
- **🧹 Clean Uninstall Guarantee:** Built exclusively on Online Store 2.0 app blocks. Leaves ZERO leftover code or broken scripts in `theme.liquid`.

---

## 📝 3. Descrição Completa do App (Detailed Description - English)

```markdown
### Supercharge Your Average Order Value (AOV) Without Slowing Down Your Store.

Most bundle apps on the Shopify App Store are heavy, slow, and bloated. They inject 100KB+ of clunky JavaScript libraries into your product pages, dragging down your Google PageSpeed score and costing you mobile conversions.

**ZeroBloat Bundles is built differently.**

We engineered ZeroBloat Bundles from the ground up for high-growth merchants who care about speed, clean code, and maximum conversion rates. With a frontend bundle of under 4KB, it loads instantly, integrates seamlessly with your native theme cart drawer, and applies genuine checkout discounts powered by Shopify's modern WebAssembly Functions API.

---

### 🔥 What You Can Do With ZeroBloat Bundles:

#### 1. Tiered Volume Discounts (Quantity Breaks)
Incentivize bulk purchases directly on your product pages:
- Display 1 to 6 dynamic pricing tiers (e.g., Buy 1 standard price, Buy 2 Save 15%, Buy 3 Save 25%, Buy 5 Save 35%).
- Cascading variant dropdowns: Customers can pick different sizes or colors for each item in the bundle!
- Eye-catching badges ("Most Popular", "Best Value", "Mega Pack") with live crossed-out compare-at prices.

#### 2. Mix & Match Cross-Sell (Frequently Bought Together)
Create Amazon-style bundles with products that naturally go together:
- Select up to 20 complementary products per offer.
- Visual thumbnail chain (`Product A + Product B = Discount`) with smooth animations.
- Progressive discounts: 2 items get 15% OFF, 3 items get 20% OFF, 4+ items get 25% OFF!
- Automatic out-of-stock detection ensures customers never buy unavailable items.

#### 3. Urgency & Scarcity Countdown Timers
Trigger instant buying decisions with psychological urgency:
- **Evergreen Session Timer:** Give each visitor an individualized countdown (e.g., 15 or 30 minutes) stored securely in session storage to create genuine FOMO.
- **Fixed Campaign Date:** Set hard deadlines for Black Friday, Cyber Monday, or seasonal clearances (e.g., 2026-12-31 23:59).
- Configurable expiration actions: automatically hide the offer, restart the timer, or disable the button with an "Offer Expired" badge.

#### 4. Powered by Modern Shopify Functions
- Zero draft orders or confusing redirects.
- Zero fake hidden duplicate products in your catalog.
- Fully compatible with Shop Pay, PayPal, Apple Pay, and native Shopify checkout.

---

### 💡 Why Merchants Choose ZeroBloat:
- **Zero Coding Required:** Add, drag, drop, and customize colors and fonts directly inside the Shopify Theme Editor.
- **Mobile First & Responsive:** Looks stunning on iPhones, Android devices, tablets, and desktops.
- **Instant Cart Drawer Sync:** Fires native theme events so your slide-out cart updates immediately without a page refresh.
```

---

## 💰 4. Estrutura de Preços (Pricing Plans)

### Plano 1: Free (Gratuito)
* **Preço:** `$0 / mês` (Grátis para sempre)
* **Recursos inclusos:**
  - Descontos por Volume (Tiered Volume Discounts)
  - Até 3 tiers de desconto
  - Produtos ilimitados
  - Integração nativa com carrinho
  - Suporte padrão por email

### Plano 2: ZeroBloat Pro (Recomendado)
* **Preço:** `$6.90 / mês` (com **7 dias de teste grátis**)
* **Recursos inclusos:**
  - **Tudo do plano gratuito +**
  - **Mix & Match Cross-Sell (Compre Junto)**
  - Até 6 tiers progressivos por produto
  - Seleção de até 20 produtos por oferta
  - **Cronômetro de Urgência & FOMO** (Evergreen + Data Fixa)
  - Pedidos ilimitados com desconto
  - Motor WebAssembly no checkout com 0ms de delay
  - Suporte prioritário 24/7

---

## ❓ 5. Perguntas Frequentes (FAQ for Merchants)

**Q: Will ZeroBloat Bundles slow down my store?**  
**A:** Absolutely not. ZeroBloat is engineered without any heavy dependencies (no jQuery, no React on the storefront). The entire frontend script is under 4KB, making it one of the fastest bundle apps on the planet.

**Q: Does it work with my slide-out cart / cart drawer?**  
**A:** Yes! ZeroBloat dispatches standard Shopify cart events (`cart:updated`, `cart:refresh`) so modern Online Store 2.0 themes (like Dawn, Impulse, Prestige, Focal) update their slide-out cart immediately when a bundle is added.

**Q: How are discounts calculated?**  
**A:** We use Shopify's official Product Discount Functions API. When a customer adds a bundle, Shopify calculates the discount natively in WebAssembly at the checkout screen. Customers see the exact discount line item on their receipt.

**Q: What happens if I uninstall the app?**  
**A:** ZeroBloat uses Online Store 2.0 Theme App Extensions. When you remove the app or disable the blocks, absolutely zero leftover scripts or broken code remain in your theme. Your store stays 100% clean.

---

## 🔒 6. Política de Privacidade & Termos (Privacy Policy Template)

A Shopify exige uma URL de política de privacidade para aprovar o app. Você pode hospedar este texto em `https://zerobloat.com/privacy` ou no seu domínio:

```markdown
# Privacy Policy - ZeroBloat Bundles
Last updated: October 2026

ZeroBloat Bundles ("the App") provides tiered pricing and bundle cross-sell functionality to merchants using Shopify.

### 1. Information We Collect
When you install the App, we automatically access certain information from your Shopify account necessary for the app to function:
- Shop domain, shop name, and primary email address (to identify your account and send important service notices).
- Product catalog data (read-only access to display titles, variants, images, and prices in bundle widgets).
- Order & discount events (to apply automatic checkout discounts via Shopify Functions).

We DO NOT collect, store, or sell any personal data belonging to your end-customers (such as customer credit card details, physical addresses, or personal identity information). All checkout transactions are processed directly by Shopify.

### 2. How We Use Information
We use the collected information solely to:
- Render bundle widgets on your online store.
- Apply volume discounts and cross-sell offers at checkout.
- Provide customer support and debug potential store issues.

### 3. Data Retention & Deletion
If you uninstall the App, your store's session data is automatically purged. We strictly comply with Shopify's mandatory GDPR and CCPA webhooks (customer data request, customer data erasure, and shop data erasure).

### 4. Contact Us
For privacy-related questions, please contact: support@zerobloat.com
```
