# 004 - Nova Logo e IA · Tasks

Regras de execução (ver `.claude/RULES.md`):
- Cada fase usa uma branch `feat/<nome>`, e cada task vira um commit.
- Toda lógica que não depende de layout (Markdown da documentação, `AGENTS.md`, montagem do SVG) tem teste em `tests/` escrito **antes** da implementação (TDD).
- No fim, as branches `feat/*` são mergeadas em `release/004-nova-logo-e-ia`. A branch já tem o commit das pendências da spec 003, que não entrou na `main`.
- O site é testado no Chrome em `localhost:4200`. A logo é lida do Figma pelo Figma MCP (arquivo `XJ2Jv3Lrs01vvd6I9v5ESL`, frames `188:2` e `189:88`).

## Fase 1 · `feat/logo`

- [ ] **1.1** Ler os frames **Borg Eye Open** e **Borg Eye Closed** com o Figma MCP (`get_design_context` e exportação dos vetores) e guardar os SVGs exportados em `assets/figma/`, sem o fundo cinza do quadro.
- [ ] **1.2** Montar `assets/logo-animada.svg`: um SVG único com os grupos nomeados `cabeca`, `penas`, `bico`, `olhos`, `pupilas` e `palpebras`. As pálpebras ficam na posição do olho aberto, e o deslocamento até a posição do olho fechado vem dos dois frames.
- [ ] **1.3** Criar o script de build que gera, a partir de `assets/logo-animada.svg`, as versões estáticas `assets/logo.svg` (olho aberto) e `assets/logo-fechada.svg` (olho fechado). Testar primeiro que as duas saem com os mesmos grupos e que só as pálpebras mudam.
- [ ] **1.4** Conferir o favicon em 16 e 32 px. Se os contornos finos sumirem, gerar `assets/favicon.svg` simplificado no mesmo build e apontar o `<link rel="icon">` das páginas para ele. Registrar a decisão.
- [ ] **1.5** Ajustar os tokens de cor do site (`docs/css/tokens.css`) se as cores da nova logo forem diferentes das atuais, nos temas claro e escuro.

## Fase 2 · `feat/logo-no-site`

- [ ] **2.1** Trocar a logo do topo de todas as páginas e o favicon pela nova (`docs/js/layout.js` e os `.html`).
- [ ] **2.2** Fazer a coruja pequena do topo piscar uma vez ao abrir a página, no lugar do "acordar" atual.
- [ ] **2.3** Redesenhar a coruja grande da página inicial (`docs/js/paginas/inicio.js`) com o SVG novo. As pupilas seguem o mouse dentro do branco do olho, a coruja pisca no clique e reage ao teclado, e o código Borg mostrado ao lado continua curto e igual ao que roda.
- [ ] **2.4** Fazer a coruja da página inicial piscar sozinha a cada 4 a 7 segundos, com intervalo sorteado.
- [ ] **2.5** Respeitar `prefers-reduced-motion`: sem piscar sozinha e sem animação ao abrir a página. Clique e teclado trocam o estado sem transição.

## Fase 3 · `feat/markdown-para-ia`

- [ ] **3.1** Criar `htmlParaMarkdown(html)` em `docs/js/ia/`, que converte o HTML dos dados (`<code>`, `<strong>`, `<em>`, `<kbd>`, `<a>`, listas) para Markdown e deixa os links absolutos com `URL_DO_SITE`. Teste primeiro.
- [ ] **3.2** Criar `documentacaoEmMarkdown()`, que monta a documentação completa a partir de `docs/js/dados/`: o que é a Borg, uso com e sem `import`, regras gerais (seletores, `parar()`, mensagens `[Borg]`, nomes de tecla), todas as funções (assinatura, descrição, parâmetros, retorno, dicas, cuidados e exemplo com `import`), receitas e problemas comuns. Testar primeiro que todas as funções públicas aparecem, que os exemplos têm o `import` e que não sobra HTML.
- [ ] **3.3** Mover para `docs/js/dados/` os textos que hoje só existem dentro das páginas e que entram no Markdown (por exemplo, os problemas comuns de `comecar.js`), para manter uma fonte só.
- [ ] **3.4** Criar o botão **"Copiar para IA"** no topo de todas as páginas, ao lado do botão de tema (dentro do menu no celular). Ele usa a função de copiar que o site já tem, confirma com "Copiado!" e explica para que serve na dica do botão.

## Fase 4 · `feat/tutor-ia`

- [ ] **4.1** Escrever o prompt de tutor em `docs/js/dados/tutor.js`, em português, com o bloco "Ajustes do professor" no topo e as regras da spec: não entregar a solução, guiar com perguntas e dicas em etapas, pedir que o aluno explique, ensinar a ler as mensagens `[Borg]`, indicar a seção da documentação, não inventar funções, preferir a Borg ao JavaScript puro enquanto o aluno aprende, responder em português de forma curta, valorizar o progresso e só abrir exceções escritas pelo professor.
- [ ] **4.2** Criar `gerarAgentsMd()`, que junta as regras de tutor e a documentação completa em um arquivo. Testar primeiro que as regras vêm antes da documentação, que todas as funções públicas aparecem e que o bloco "Ajustes do professor" está no topo.
- [ ] **4.3** Criar a seção **"IA na aula"** na página Professores: por que usar a IA como tutor, onde criar o `AGENTS.md`, quais ferramentas leem o arquivo sozinhas e como usar com as outras (`CLAUDE.md`, `.github/copilot-instructions.md`, colar no começo da conversa). Incluir o prompt em um bloco de código e os botões **"Copiar AGENTS.md"**, **"Baixar AGENTS.md"** e **"Copiar para IA"**.
- [ ] **4.4** Adicionar o aviso curto no passo 1 da página Começar, apontando para o `AGENTS.md` quando o aluno usa IA.

## Fase 5 · `feat/logo-coerencia`

- [ ] **5.1** Atualizar o `README.md` da raiz (logo nova, botão "Copiar para IA" e `AGENTS.md`) e o `CLAUDE.md` (descrição da marca, `docs/js/ia/`, fonte única do Markdown e do `AGENTS.md`).
- [ ] **5.2** Atualizar a extensão para a versão `0.1.1`: logo nova no ícone (gerado no build), entrada no `CHANGELOG.md` e README da extensão com a logo nova. Gerar o `.vsix` com `npm run build:extensao`.
- [ ] **5.3** Publicar a `0.1.1` no Marketplace pelo upload do `.vsix` no painel do publisher (passo do dono do projeto, como na spec 003) e conferir a página. Se o Open VSX já estiver configurado (task 8.1 da spec 003), publicar lá também.
