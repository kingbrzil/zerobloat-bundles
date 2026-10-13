# ⚡ ZeroBloat Bundles — Guia de Execução, Teste e Publicação

Parabéns pela escolha do nome! **ZeroBloat Bundles** resume perfeitamente a maior dor dos lojistas na Shopify: eles querem vender combos com desconto de quantidade (compre 2 leve 10% OFF, compre 3 leve 20% OFF), mas **todos os apps concorrentes deixam o site lento, pesam centenas de kilobytes e quebram na hora de desinstalar**.

O seu app é construído com arquitetura **Zero Bloat**:
- **Menos de 10KB no total** (Vanilla JS + CSS puro).
- **Online Store 2.0 Nativo**: Funciona como App Block no editor de temas.
- **Cart API nativa**: Adiciona direto no carrinho sem precisar de servidores externos no carregamento da página.

---

## 🚀 Passo a Passo: Rodando e Conectando na sua Loja

### 1. Como iniciar o App

Abra o seu terminal (PowerShell ou VS Code) na pasta do projeto:
```powershell
cd C:\Users\visitante\Desktop\shopify_apps\zerobloat-bundles
npm run dev
```

### 2. O que o Shopify CLI vai fazer automaticamente:
1. **Login no Shopify Partners:** Vai abrir uma janela no seu navegador pedindo autorização na sua conta de parceiro Shopify.
2. **Criação do App:** Vai perguntar se deseja criar um novo app chamado `ZeroBloat Bundles` (confirme com Enter).
3. **Seleção da Loja de Teste:** Ele vai listar as suas lojas de desenvolvimento (Development Stores). Basta selecionar a sua loja.
4. **Link do Painel & Preview:** Ele vai gerar o link do túnel para abrir o painel administrativo dentro da Shopify!

---

## 🎨 Como Ativar e Ver o Widget na sua Loja

Assim que o comando `npm run dev` estiver rodando:

1. Acesse o admin da sua loja de testes na Shopify.
2. Vá em **Loja virtual (Online Store)** > **Temas (Themes)** > clique em **Personalizar (Customize)**.
3. No topo da tela, mude a página de "Página inicial" para **Produtos (Products) -> Produto padrão (Default product)**.
4. Na coluna esquerda, sob a seção **Informações do produto (Product information)**, clique em **Adicionar bloco (Add block)**.
5. Na aba **Apps**, você verá **ZeroBloat Bundles**! Clique nele.
6. Arraste o bloco para onde quiser (ex: logo acima do botão "Comprar agora" ou "Adicionar ao carrinho").
7. Configure as opções no menu lateral:
   - Título: *Compre Mais & Economize*
   - Tier 1: 1 unidade (Preço normal)
   - Tier 2: 2 unidades (10% OFF - Badge "Mais Popular")
   - Tier 3: 3 unidades (20% OFF - Badge "Melhor Oferta")
   - Cores da borda, botão e badges.
8. Clique em **Salvar (Save)** no topo direito!

---

## 🧪 Como Testar no Navegador Antes de Rodar na Shopify

Você já tem uma prévia 100% interativa criada para ver o visual e o comportamento do widget:
- Arquivo: `C:\Users\visitante\Desktop\shopify_apps\zerobloat-bundles\preview_demo.html`
- Basta dar dois cliques nesse arquivo para abrir no seu Google Chrome ou Edge e testar a seleção de variantes e o cálculo dos descontos em tempo real!

---

## 💰 Estratégia de Preço e ASO (Para Vender Rápido)

- **Plano Grátis:** Até 50 pedidos de bundle por mês (atrai lojistas pequenos que não querem pagar nada no início).
- **Plano Pro:** **$4.99 a $6.99/mês** (ilimitado, mais barato que os concorrentes que cobram $19 a $39/mês).
- **Palavras-chave no título e descrição da App Store:**
  - *ZeroBloat Bundles — Fast Volume Discount & Tiered Pricing*
  - *"Shopify bundles alternative", "fast bundle", "quantity breaks", "volume discount", "clean code", "zero slowdown"*.
