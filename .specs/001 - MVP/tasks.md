# 001 - MVP · Tasks

Regras de execução (ver `.claude/RULES.md`):
- Cada fase usa uma branch `feat/<nome>`, e cada task vira um commit.
- Na biblioteca, o teste é escrito **antes** da implementação (TDD).
- No fim, as branches `feat/*` são mergeadas em `release/001-mvp`.

## Fase 1 · `feat/setup`

- [x] **1.1** Fazer `git init`, criar `.gitignore` e `package.json` (nome `borg-js`, `"type": "module"`) e definir os scripts `dev`, `build`, `test` e `lint`.
- [x] **1.2** Configurar o Vite em modo biblioteca. A entrada é `src/index.js` e as saídas são `dist/borg.js` (IIFE com global `Borg`) e `dist/borg.mjs` (ESM).
- [x] **1.3** Configurar Vitest com jsdom e escrever um teste "smoke" que verifica que `src/index.js` exporta um objeto.
- [x] **1.4** Configurar ESLint.
- [x] **1.5** Criar a logo `assets/logo.svg`: coruja minimalista com gradiente de `#2DD4BF` a `#38BDF8`.
- [x] **1.6** Escrever o `README.md` inicial (o que é a lib, como instalar e como rodar).

## Fase 2 · `feat/nucleo-mouse`

- [x] **2.1** Criar o utilitário interno `resolverElementos(seletor)` (aceita string ou elemento e retorna uma lista) e as mensagens de aviso e erro em português (`src/nucleo/`).
- [x] **2.2** `aoClicar(seletor, callback)` com retorno `parar()`.
- [x] **2.3** `aoClicarNaTela(callback)`, que entrega `{ x, y }`.
- [x] **2.4** `aoMoverMouse(callback)`, que entrega `{ x, y }`.

## Fase 3 · `feat/teclado`

- [x] **3.1** Criar o mapa de teclas em português para `KeyboardEvent.key` (letras, números, `espaço`, `enter`, `esc`, setas e `qualquer`), sem diferenciar maiúsculas de minúsculas.
- [x] **3.2** `aoPressionar(tecla, callback)` com retorno `parar()`.
- [x] **3.3** `aoSoltar(tecla, callback)` com retorno `parar()`.
- [x] **3.4** `teclaPressionada(tecla)`, baseada no estado das teclas (keydown/keyup). O estado é limpo quando a janela perde o foco (`blur`).

## Fase 4 · `feat/helpers`

- [x] **4.1** `mostrar(seletor)` e `esconder(seletor)`.
- [x] **4.2** `alternarClasse(seletor, classe)`.
- [x] **4.3** `mudarTexto(seletor, texto)`.
- [x] **4.4** `mudarEstilo(seletor, propriedade, valor)`, aceitando os formatos kebab-case e camelCase.
- [x] **4.5** Exportar todas as funções em `src/index.js` e escrever um teste que garante a API pública completa.

## Fase 5 · `feat/docs`

- [x] **5.1** Criar o site em `docs/` servido pelo Vite em `localhost:4200`, usando a logo como favicon e no cabeçalho.
- [x] **5.2** Escrever a introdução e a instalação (script tag e ESM).
- [x] **5.3** Escrever uma seção por função, com descrição, parâmetros, retorno e exemplo interativo.
- [x] **5.4** Revisar o JSDoc de todas as funções públicas, em português e com exemplos.

## Finalização

- [x] Mergear as branches `feat/*` em `release/001-mvp`.
- [x] Rodar `npm run build` e `npm test` e confirmar que tudo passa.
- [x] Subir o site em `localhost:4200` e testar no Chrome todos os exemplos interativos.
