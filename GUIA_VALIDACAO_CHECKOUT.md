# 🛒 Guia Rápido de Teste do Checkout - ZeroBloat Bundles

Este guia explica como testar o desconto real caindo no checkout da sua loja de teste em 2 minutos.

---

### Passo 1: Status do Motor de Desconto
1. O motor WebAssembly (**Checkout Discount Engine**) já está **ACTIVE** na loja via API!
2. Não é necessário ativar nada manualmente.

---

### Passo 2: Fazer uma Compra Teste no Storefront
1. Acesse o produto através do preview local ativo da Shopify CLI:
   👉 `http://127.0.0.1:9293/products/the-collection-snowboard-liquid`
   *(Ou qualquer produto da loja usando o host 127.0.0.1:9293)*
2. No widget do **ZeroBloat Bundles**, selecione o **Tier 2 (Buy 2 / 2 unidades)** com 15% OFF (ou **Tier 3** com 25% OFF).
3. Clique no botão verde **"Add Bundle to Cart"**.
4. O widget adicionará as peças com a propriedade `_bundle_discount: 15%` e levará ao Checkout nativo da Shopify.

---

### Passo 3: Conferir o Desconto no Checkout
1. Na tela de checkout da Shopify (onde o cliente digita o endereço e cartão):
   - Olhe na lateral direita, no resumo do pedido.
   - Você verá a linha de desconto aplicada automaticamente pela Shopify Function:
     🏷️ **ZeroBloat Bundle (15% OFF)** ou **(25% OFF)**
   - O valor total do pedido estará reduzido com o desconto real!

---

### Passo 4: Testar a Assinatura do Plano Pro ($6.90/mês)
1. No painel do aplicativo (no Admin da Shopify), na lateral direita onde diz **"Your Current Plan"**:
2. Clique no botão **"Upgrade to Pro ($6.90/mo)"**.
3. A Shopify abrirá a tela oficial de aprovação de cobrança de teste (*Test Charge - You will not be billed*).
4. Clique em **"Approve"**.
5. Ao retornar para o app, o selo mudará para **PRO ACTIVE ($6.90/mo)** com selo verde!
