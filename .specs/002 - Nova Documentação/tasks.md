# 002 - Nova Documentação · Tasks

Regras de execução (ver `.claude/RULES.md`):
- Cada fase usa uma branch `feat/<nome>`, e cada task vira um commit.
- Toda lógica que não depende de layout (montar o documento do playground, gerar o HTML de um projeto, URLs, captura do console) tem teste em `tests/docs/` escrito **antes** da implementação (TDD).
- No fim, as branches `feat/*` são mergeadas em `release/002-nova-documentacao`.
- O site continua importando `src/` direto. Os IDs de exemplos são únicos em cada página.

## Fase 1 · `feat/docs-base`

- [x] **1.1** Transformar o site em multipágina no Vite (`docs/index.html`, `comecar.html`, `funcoes.html`, `professores.html`, `desafios.html`, `projetos.html`), com um `main.js` comum e um arquivo de entrada por página.
- [x] **1.2** Criar `docs/config.js` com a constante `URL_DO_SITE` (`https://borg.lenoborges.br`) e as URLs derivadas de `borg.mjs` e `borg.js`. Todo texto e exemplo da documentação usa essas constantes. Teste primeiro.
- [x] **1.3** Criar o plugin do Vite `publicarBiblioteca`. Ele gera `borg.mjs` e `borg.js` a partir de `src/` usando a mesma configuração de lib de `vite.config.js`. No `npm run dev`, serve os dois em `localhost:4200/`. No `npm run build:docs`, emite os dois na raiz de `docs-dist/`.
- [x] **1.4** Configurar no `vercel.json` os cabeçalhos de `/borg.mjs` e `/borg.js`: `Access-Control-Allow-Origin: *` e `Content-Type: text/javascript`.
- [x] **1.5** Reescrever os tokens de design em `estilo.css` (cores, gradiente, espaçamentos, raios, sombras, tipografia, temas claro e escuro) e separar o CSS por responsabilidade (base, layout, componentes, páginas).
- [x] **1.6** Criar o layout comum: topo com logo, menu das páginas (link ativo destacado), botão de tema claro/escuro salvo no `localStorage` (com `try/catch`) e rodapé. No celular, o menu vira um botão que abre e fecha.

## Fase 2 · `feat/docs-componentes`

- [x] **2.1** Adicionar o CodeMirror 6 e criar o componente de bloco de código somente leitura, com realce de sintaxe (HTML, JS, CSS) e botão "Copiar". Ele substitui `blocoDeCodigo` em todo o site.
- [x] **2.2** Criar `montarDocumentoDoPlayground({ html, js, css })`, que gera o `srcdoc` do iframe com:
  - um `importmap` que redireciona a URL pública de `borg.mjs` para a `borg.mjs` da origem atual (assim o `import` funciona em `localhost:4200` e nos previews da Vercel);
  - o JS do aluno em `<script type="module">`;
  - um script que repassa `console.log/warn/error` e erros não capturados para a página com `postMessage`.

  Teste primeiro.
- [x] **2.3** Criar o componente de playground: abas HTML e JS editáveis (CodeMirror), resultado em iframe isolado, atualização ao digitar (com atraso de ~500 ms), botões "Rodar", "Restaurar" e "Copiar" e um console embaixo do resultado que mostra erros e avisos `[Borg]`. Em telas estreitas, o resultado fica embaixo do código.
- [x] **2.4** Criar os componentes de conteúdo: caixa "Dica"/"Cuidado", cartão, passo numerado e bloco recolhível ("Ver solução").
- [x] **2.5** Criar a animação de entrada das seções ao rolar (`IntersectionObserver`), desligada com `prefers-reduced-motion`.

## Fase 3 · `feat/docs-inicio`

- [x] **3.1** Criar o herói: logo animada com o gradiente, título, frase curta e os botões "Começar agora" (→ Começar) e "Sou professor" (→ Professores).
- [x] **3.2** Criar a demonstração ao vivo feita com a Borg, que reage ao mouse, ao clique e ao teclado, com o código curto (estilo `import`) ao lado.
- [x] **3.3** Criar a seção "Por que a Borg?" (funções em português, erros que ensinam, pouco código, foco em HTML/CSS) e os cartões de atalho para as outras páginas.

## Fase 4 · `feat/docs-funcoes`

- [x] **4.1** Reescrever os exemplos de `docs/funcoes.js` no estilo `import` (exports nomeados, sem `Borg.`) e trocar o palco atual pelo playground.
- [x] **4.2** Adicionar a linha "Dica"/"Cuidado" nas funções com comportamento importante (`aoPressionar` não repete, rolagem bloqueada, `teclaPressionada` começa na primeira chamada, seletor resolvido na hora da chamada etc.).
- [x] **4.3** Mover "Como funciona" (seletores, `parar()`, mensagens de ajuda) para a página Funções.
- [x] **4.4** Escrever a seção "Usando sem import": exemplo com `<script src>` de `borg.js` e `Borg.` dentro de `<script>`, quando essa forma é útil e o aviso de que ela funciona em `file://`.
- [x] **4.5** Criar o menu lateral com destaque da seção visível. No celular, ele vira um menu recolhível.

## Fase 5 · `feat/docs-guias`

- [x] **5.1** Escrever a página Começar, passos 1 a 4: pasta, `index.html` e `main.js`, `type="module"` (e por quê), o `import` pela URL do site (e o que é um `import`) e o primeiro botão.
- [x] **5.2** Escrever os passos 5 a 7: servir a pasta (Live Server) e por que `file://` não funciona com módulos, abrir o console e corrigir um erro proposital, próximos passos.
- [x] **5.3** Escrever o quadro "Problemas comuns" (sintoma → solução).
- [x] **5.4** Escrever a página Professores: o que é e para quem é, o que a Borg esconde e por quê, e a sequência das 6 aulas (objetivo, funções e desafio recomendado em cada uma).
- [x] **5.5** Escrever "Erros comuns dos alunos" (ligados às mensagens `[Borg]`), "Da Borg ao JavaScript puro" (equivalente em DOM puro de cada função) e "Como usar desafios e projetos em aula".

## Fase 6 · `feat/docs-desafios-projetos`

- [x] **6.1** Definir o formato dos dados em `docs/desafios.js` (título, nível, enunciado, funções, código inicial, solução) e montar a página Desafios agrupada por nível, com playground e "Ver solução" (que também pode carregar a solução no playground).
- [x] **6.2** Escrever pelo menos 3 desafios **Fácil** e 3 **Médio**.
- [x] **6.3** Escrever pelo menos 3 desafios **Difícil**.
- [x] **6.4** Criar `gerarHtmlDoProjeto({ html, css, js })`, que monta um único arquivo HTML completo com o `import` pela URL pública. Teste primeiro.
- [x] **6.5** Montar a página Projetos (descrição, funções usadas, playground e botão "Copiar projeto inteiro") com pelo menos 3 projetos: jogo com as setas, quiz e galeria de imagens.

## Fase 7 · `feat/docs-coerencia`

- [x] **7.1** Trocar o `@example` do JSDoc das funções públicas para o estilo `import`.
- [x] **7.2** Atualizar o `README.md`: instalação pelo `import` da URL do site como uso principal, a script tag como alternativa e o link para o site.
- [x] **7.3** Atualizar o `CLAUDE.md`: a convenção do `@example`, a estrutura multipágina de `docs/`, o plugin `publicarBiblioteca` e o playground.

## Finalização

- [x] Mergear as branches `feat/*` em `release/002-nova-documentacao`.
- [x] Rodar `npm test`, `npm run lint`, `npm run build` e `npm run build:docs` e confirmar que tudo passa.
- [x] Subir o site em `localhost:4200` e testar no Chrome: todas as páginas, todos os playgrounds (editar, Rodar, Restaurar, Copiar, console), "Ver solução", "Copiar projeto inteiro", tema claro/escuro, menu no celular (largura ~375px) e o `import` de `/borg.mjs` em um arquivo HTML fora do site.
- [x] Rodar `npm run build:docs` e `npx vite preview --config vite.docs.config.js` e confirmar que `borg.mjs` e `borg.js` estão na raiz da saída.
- [x] Abrir o PR contra a `main` com as decisões tomadas no topo.
