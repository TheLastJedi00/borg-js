# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # docs site at http://localhost:4200 (vite.docs.config.js, root docs/)
npm test             # Vitest + jsdom, runs once
npm run test:watch
npx vitest run tests/teclado/aoPressionar.test.js   # one test file
npx vitest run -t "aoClicar"                       # tests whose name matches
npm run build        # library: dist/borg.js (IIFE, global Borg) + dist/borg.mjs (ESM)
npm run build:docs   # static docs site in docs-dist/, with borg.mjs and borg.js at its root
npm run build:logo         # assets/logo.svg (open eyes) and logo-fechada.svg from assets/logo-animada.svg
npm run build:extensao     # VS Code extension .vsix in dist-extensao/
npm run publicar:extensao  # publish the .vsix to the VS Code Marketplace and Open VSX (needs VSCE_PAT and OVSX_PAT)
npm run lint
```

## Architecture

- `src/index.js` is the only public entry point. `tests/index.test.js` fails if a public function is added or removed without updating its list on purpose.
- `src/nucleo/` holds shared internals:
  - `resolverElementos(seletor, nomeFuncao)` turns a CSS selector, element, NodeList or array into `Element[]`. When nothing matches, it warns instead of throwing. `primeiroElemento` returns the first one or `null`.
  - `mensagens.js` holds `avisar`, `erroDeTipo`, `validarFuncao`, `validarTexto` and `validarVetor` (`{ x, y }` with at least one axis). Every user-facing message is in Portuguese, starts with `[Borg] <nomeFuncao>:` and explains how to fix the problem.
- `src/eventos/mouse.js` handles element and page mouse events. `src/teclado/` handles keys:
  - `teclas.js` maps Portuguese key names to `KeyboardEvent.key`.
  - `eventos.js` implements `aoPressionar` and `aoSoltar`.
  - `estado.js` implements `teclaPressionada`, which has lazy global state.
- `src/helpers/` holds the DOM reaction helpers (`mostrar`, `esconder`, `alternarClasse`, `mudarTexto`, `mudarEstilo`).
- `src/movimento/` handles position on the screen (viewport), in pixels, as `{ x, y }` vectors:
  - `leitura.js`: `elemento`, `posicao`, `tamanho`, `tamanhoDaTela`. Functions that read use the selector's first element.
  - `posicionar.js`: `moverPara`, `moverPor`, `manterNaTela`, `colidiu`. Moving uses `position: fixed` with `left`/`top`, then measures and corrects for margins or `transform`, so `posicao` returns the requested point.
  - `tela.js`: `estaNaTela`, `aoEntrarNaTela`, `aoSairDaTela` (`IntersectionObserver`).
  - jsdom has no layout: tests simulate `getBoundingClientRect` with `tests/movimento/retangulo.js`.
- `sugestoes/` is the single source of the autocomplete. `dados.js` lists every public function with a VS Code-format snippet (`${1:#meu-seletor}`, `$0`); a test fails if a public function has no suggestion. `modelo.js` converts snippets to CodeMirror, `importar.js` creates or completes the Borg `import`, and `teclas.js` suggests key names inside quotes.
- `extensao-vscode/` is the **Borg JS** VS Code extension. `src/provedor.js` holds the editor-independent logic (tested in `tests/extensao/`); `src/extensao.js` adapts it to the `vscode` API. `build/extensao.js` renders the icon from `assets/logo.svg`, bundles with `extensao-vscode/vite.config.js` and packages or publishes the `.vsix`. Publishing reads `VSCE_PAT` and `OVSX_PAT` from the environment; tokens never go in the repo. The `publisher` in its `package.json` must match `PUBLISHER_DA_EXTENSAO` in `docs/js/url.js`.
- Every `ao*` function validates its arguments, registers listeners and returns `parar()`, which removes them.
- The docs site (`docs/`) is multi-page (`index`, `comecar`, `funcoes`, `professores`, `desafios`, `projetos`). Each `.html` loads `docs/js/paginas/<pagina>.js`, which calls `iniciarPagina()` from `docs/js/layout.js` (shared header, menu, theme toggle, footer) and renders its content from `docs/js/dados/`.
  - `docs/js/url.js` holds the official URL (`URL_DO_SITE`), the extension links and `linhaDeImport`, with no import of the library (the extension bundles it). `docs/js/config.js` re-exports them and adds `comImport`, which adds the `import` for the Borg functions a snippet calls. Never hard-code the domain.
  - The playground's JS editors get the Borg autocomplete from `docs/js/codigo/autocomplete.js`.
  - `docs/js/ia/` builds the docs for AI agents from the same `docs/js/dados/` the pages use: `markdown.js` (`htmlParaMarkdown`), `documentacao.js` (`documentacaoEmMarkdown`, behind the "Copiar para IA" button in the header) and `agents.js` (`gerarAgentsMd`: the tutor rules from `dados/tutor.js` plus the full docs, on the Professores page). These modules are loaded on demand. Text that should reach the AI must live in `docs/js/dados/`, not only inside a page.
  - Tests that import page modules using `matchMedia` or `IntersectionObserver` at load time import `tests/docs/ambiente-do-navegador.js` first.
  - The build plugin `build/publicarBiblioteca.js` builds `borg.mjs` and `borg.js` from `src/`, using the same lib config as `vite.config.js` (`build/biblioteca.js`). It serves them in `npm run dev` and emits them at the root of `docs-dist/`. `vercel.json` adds CORS headers so other sites can import them.
  - Examples run in a **playground** (`docs/js/playground/`): CodeMirror editors and a sandboxed `iframe` built by `montarDocumentoDoPlayground`. An import map points the public URL to the current origin's `borg.mjs`, and a bridge forwards `console` and errors to the panel under the result. Playgrounds mount lazily when they get close to the screen. Keep playground IDs unique within a page.
  - Example data (`dados/funcoes.js`, `desafios.js`, `projetos.js`) holds `js` without the `import`; pages add it. Projects carry their full CSS and use `estiloBase: false`.
  - Pure docs logic (URLs, playground document, project file, error hints) is tested in `tests/docs/`.

## Conventions

- Identifiers, JSDoc, test names, commit messages and error messages are in Portuguese. Every public function's JSDoc has `@param`, `@returns`, `@throws` and an `@example` that starts with `import { ... } from 'https://borg.lenoborges.com.br/borg.mjs'` and calls the functions without the `Borg.` prefix. Teaching material uses this `import` style first; the script tag with the global `Borg` is documented only in the "Usando sem import" section.
- TDD: write the test in `tests/` (mirroring `src/`) before the implementation.
- Commit messages use conventional prefixes (`feat:`, `test:`, `docs:`, `chore:`, `build:`).

## What Borg JS is

Borg JS is an **educational** JavaScript library whose public functions are **named and documented in Portuguese**. It hides the heavy DOM-control logic so learners can focus on simple reaction logic and on HTML/CSS design. The core feature is making elements react to mouse clicks, buttons and the keyboard in a very short, simple way.

Branding: the logo is the owl designed in Figma (file "Leno Borges", frames "Borg Eye Open" and "Borg Eye Closed"; exports in `assets/figma/`), with a gradient from teal `#00BCB8` to blue `#3986FF` and navy `#324E7B` outlines. `assets/logo-animada.svg` is the source: its parts are classes (`cabeca`, `bico`, `olhos`, `pupilas`, `palpebras-cima`, `palpebras-baixo`, `penas`), and closing the eyes only moves the eyelids 130 units. `docs/js/logo.js` inlines it with unique ids (`svgDaLogo`), and the `.fechada` class closes the eyes (`piscar`, `piscarSozinha`, respecting `prefers-reduced-motion`).

## Spec-driven workflow

All work is driven by specs in `.specs/<NNN - name>/`, for example `.specs/001 - MVP/`. Each spec folder holds:
- `context.md`: the requirements, written in Portuguese.
- `tasks.md`: the phases and tasks. It may not exist yet.
- `fix.md`: bug-fix requests. Optional.

Before starting work, read earlier specs so you follow the project's established patterns.

The full command workflow (Revisar, Executar, Formatar, Spec, and handling `fix.md`) is in `.claude/RULES.md`, imported below. Key points:
- **Executar**: create one `feat/<name>` branch per phase and one commit per task. Merge all phase branches into `release/<spec-name>` at the end.
- On the backend, use TDD: write the test suite before the implementation.
- Serve the frontend on `localhost:4200` and the backend on `localhost:3000`. Then open Chrome and manually test every feature that was added, changed or removed.
- When `context.md` or `tasks.md` is inconsistent, choose the option that is easiest to maintain and scale, and list those decisions at the top of the PR. Ask the user when an inconsistency is not obvious.
- Fixes: if the spec is already merged into `main`, create a `fix/<bug-name>` branch and open a PR against `main`. If the spec's PR is still open, add a fix commit to the branch that owns that PR.

@.claude/RULES.md
