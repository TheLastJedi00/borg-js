# 003 - Movimento e IntelliSense · Tasks

Regras de execução (ver `.claude/RULES.md`):
- Cada fase usa uma branch `feat/<nome>`, e cada task vira um commit.
- TDD: o teste de cada função é escrito em `tests/` (espelhando a pasta do código) **antes** da implementação.
- Toda função pública nova tem JSDoc com `@param`, `@returns`, `@throws` e um `@example` com `import` pela URL oficial, sem o prefixo `Borg.`. As mensagens começam com `[Borg] <nomeDaFuncao>:`.
- No fim, as branches `feat/*` são mergeadas em `release/003-movimento-e-intellisense`.
- O site é testado no Chrome em `localhost:4200`. A extensão é testada no VS Code ("Extension Development Host", F5).

## Fase 1 · `feat/movimento-leitura`

- [x] **1.1** Criar em `src/nucleo/` a validação de vetor `validarVetor(vetor, nomeFuncao)`. Ela aceita um objeto com `x` e/ou `y` numéricos e finitos e lança `TypeError` com exemplo de uso (`{ x: 100, y: 50 }`) nos outros casos. Teste primeiro.
- [x] **1.2** Criar `elemento(seletor)` em `src/movimento/`. Devolve o primeiro elemento encontrado, devolve o próprio elemento quando recebe um, e retorna `null` com aviso quando o seletor não encontra nada. Teste primeiro.
- [x] **1.3** Criar `posicao(seletor)` (`{ x, y }` a partir de `getBoundingClientRect`) e `tamanho(seletor)` (`{ largura, altura }`), as duas com `null` e aviso quando o seletor não encontra nada. Teste primeiro, simulando `getBoundingClientRect`.
- [x] **1.4** Criar `tamanhoDaTela()` (`innerWidth` e `innerHeight`). Teste primeiro.

## Fase 2 · `feat/movimento-posicionar`

- [x] **2.1** Criar `moverPara(seletor, { x, y })`: aplica `position: fixed`, `left` e `top` em todos os elementos do seletor e mantém o eixo omitido. Teste primeiro.
- [x] **2.2** Criar `moverPor(seletor, { x, y })`: soma o deslocamento à posição atual de cada elemento e reaproveita `moverPara`. Teste primeiro, incluindo o eixo omitido e números negativos.
- [x] **2.3** Criar `manterNaTela(seletor)`: traz o elemento de volta para dentro da janela e retorna `true` quando precisou ajustar. Teste primeiro, com o elemento passando de cada uma das quatro bordas.
- [x] **2.4** Criar `colidiu(seletorA, seletorB)`: sobreposição dos retângulos, com `false` e aviso quando um seletor não encontra nada. Teste primeiro, incluindo retângulos que só se tocam na borda.

## Fase 3 · `feat/movimento-tela`

- [x] **3.1** Criar `estaNaTela(seletor)`: `true` quando o elemento está pelo menos em parte dentro da janela. Teste primeiro.
- [x] **3.2** Criar `aoEntrarNaTela(seletor, callback)` e `aoSairDaTela(seletor, callback)` com `IntersectionObserver`, retornando `parar()`. A primeira notificação dispara `aoEntrarNaTela` se o elemento já estiver na tela e é ignorada por `aoSairDaTela`. Teste primeiro, com um `IntersectionObserver` falso.
- [x] **3.3** Exportar as 11 funções novas em `src/index.js` e atualizar a lista de `tests/index.test.js`.

## Fase 4 · `feat/sugestoes`

- [x] **4.1** Criar a fonte única das sugestões em `sugestoes/dados.js`: para cada função pública, o nome, a assinatura, uma descrição curta em português e o modelo em sintaxe de snippet do VS Code (seletor `'#meu-seletor'`, arrow function com `// reação` nas funções `ao*`). Criar um teste que falha se uma função de `src/index.js` não tiver sugestão.
- [x] **4.2** Criar `paraModeloDoCodeMirror(modelo)`, que converte `${1:texto}`, `$1` e `$0` para o formato do CodeMirror. Teste primeiro.
- [x] **4.3** Criar `editarImport(codigo, nomeDaFuncao)`, que descreve a edição do `import` da Borg: cria a linha no topo se ela não existir, acrescenta o nome em ordem alfabética se faltar, não muda nada se já estiver lá e quebra em várias linhas acima de 80 caracteres, como faz `comImport`. Usa `URL_DO_SITE`. Teste primeiro.
- [x] **4.4** Criar `sugestoesDeTecla(textoAntes)`, que reconhece quando o cursor está dentro das aspas do primeiro argumento de `aoPressionar`, `aoSoltar` ou `teclaPressionada` e devolve os nomes de tecla de `src/teclado/teclas.js`. Teste primeiro.

## Fase 5 · `feat/autocomplete-playground`

- [x] **5.1** Ligar as sugestões de função nos editores JS do playground (`docs/js/codigo/editor.js`), com `snippetCompletion` do CodeMirror, assinatura e descrição em cada item.
- [x] **5.2** Aplicar o `import` automático ao aceitar uma sugestão no playground, usando `editarImport`.
- [x] **5.3** Ligar as sugestões de nome de tecla dentro das aspas.

## Fase 6 · `feat/extensao-vscode`

- [x] **6.1** Criar `extensao-vscode/` com `package.json` (nome `borg-js`, nome de exibição **Borg JS**, ícone da coruja em PNG, ativação em JavaScript e HTML), `README.md` em português e `CHANGELOG.md`.
- [x] **6.2** Criar o provedor de sugestões de função para `.js` e `.mjs` e para o conteúdo de `<script>` em `.html`, com `SnippetString`, assinatura, descrição e o `import` automático como edição adicional (`additionalTextEdits`).
- [x] **6.3** Criar o provedor de sugestões de nome de tecla dentro das aspas.
- [x] **6.4** Criar `npm run build:extensao`: empacota a extensão com as sugestões embutidas (sem rede) e gera o `.vsix` com `@vscode/vsce`. A saída fica fora do controle de versão. Completar no `package.json` da extensão os campos exigidos pelos dois registros (`publisher`, `repository`, `license`, `icon`, `engines.vscode`).
- [ ] **6.5** Gravar o GIF do autocomplete para o `README.md` da extensão. *Pendente: precisa de uma gravação de tela do VS Code, que não dá para fazer na execução automática.*
- [x] **6.6** Criar `npm run publicar:extensao` com `@vscode/vsce` e `ovsx` (dependências de desenvolvimento). O script gera o `.vsix` uma vez e publica esse arquivo no Marketplace (`vsce publish --packagePath`, token em `VSCE_PAT`) e no Open VSX (`ovsx publish`, token em `OVSX_PAT`). Se faltar um token, ele para antes de publicar e explica qual variável definir. A lógica de checar os tokens é testada primeiro.
- [x] **6.7** Documentar no `README.md` da raiz, seção "Publicar a extensão", os passos manuais feitos uma vez: criar o publisher no Marketplace, criar o token do Azure DevOps (escopo Marketplace → Manage), criar o namespace e o token no Open VSX, e definir `VSCE_PAT` e `OVSX_PAT`. Incluir a opção de usar `vsce publish --azure-credential` no lugar do token.
- [ ] **6.8** Publicar a versão `0.1.0` nos dois registros pela CLI e conferir a página da extensão em cada um. Depende dos passos manuais da 6.7. Se os tokens não estiverem disponíveis na execução, a task fica pendente e isso é destacado no PR. *Marketplace: publicada em 06/10/2026 pelo upload do `.vsix` no site do publisher, porque o cadastro do Azure DevOps (necessário para o `VSCE_PAT`) travou. Página conferida: https://marketplace.visualstudio.com/items?itemName=lenoborges.borg-js. Open VSX: pendente (falta o `OVSX_PAT`).*

## Fase 7 · `feat/docs-movimento`

- [x] **7.1** Adicionar à página Funções uma seção com playground para cada função nova, a dica sobre `position: fixed` tirar o elemento do fluxo e a seção "Movimento suave" (`mudarEstilo` com `transition`). Atualizar o menu lateral.
- [x] **7.2** Adicionar à página Começar o passo opcional "Instale a extensão Borg JS no VS Code", com o link do Marketplace e, para quem usa Cursor ou VSCodium, o link do Open VSX.
- [x] **7.3** Adicionar à página Professores a aula "Movimento na tela", passar a aula de mini jogo para `colidiu` e acrescentar os equivalentes em DOM puro (`document.querySelector`, `position: fixed`, `getBoundingClientRect`, `IntersectionObserver`, `innerWidth`).
- [x] **7.4** Escrever 1 desafio novo por nível: mira que segue o mouse (Fácil), quadrado que não sai da tela (Médio) e pegar estrelas com colisão (Difícil).
- [x] **7.5** Reescrever o projeto do jogo com as setas usando `elemento`, `moverPor`, `manterNaTela` e `colidiu`.
- [x] **7.6** Atualizar `README.md` e `CLAUDE.md` (pastas `src/movimento/`, `sugestoes/` e `extensao-vscode/`, e o comando `npm run build:extensao`).
