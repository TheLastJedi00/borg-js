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
npm run build:docs   # static docs site in docs-dist/
npm run lint
```

## Architecture

- `src/index.js` is the only public entry point. `tests/index.test.js` fails if a public function is added or removed without updating its list on purpose.
- `src/nucleo/` holds shared internals:
  - `resolverElementos(seletor, nomeFuncao)` turns a CSS selector, element, NodeList or array into `Element[]`. When nothing matches, it warns instead of throwing.
  - `mensagens.js` holds `avisar`, `erroDeTipo`, `validarFuncao` and `validarTexto`. Every user-facing message is in Portuguese, starts with `[Borg] <nomeFuncao>:` and explains how to fix the problem.
- `src/eventos/mouse.js` handles element and page mouse events. `src/teclado/` handles keys:
  - `teclas.js` maps Portuguese key names to `KeyboardEvent.key`.
  - `eventos.js` implements `aoPressionar` and `aoSoltar`.
  - `estado.js` implements `teclaPressionada`, which has lazy global state.
- `src/helpers/` holds the DOM reaction helpers (`mostrar`, `esconder`, `alternarClasse`, `mudarTexto`, `mudarEstilo`).
- Every `ao*` function validates its arguments, registers listeners and returns `parar()`, which removes them.
- The docs site (`docs/`) imports `src/` directly and sets `window.Borg`. Each entry in `docs/funcoes.js` has `html` and `js` that are both shown as code and executed in the live demo with `new Function('Borg', js)`. Keep demo IDs unique across the page.

## Conventions

- Identifiers, JSDoc, test names, commit messages and error messages are in Portuguese. Every public function's JSDoc has `@param`, `@returns`, `@throws` and an `@example` that uses `Borg.`.
- TDD: write the test in `tests/` (mirroring `src/`) before the implementation.
- Commit messages use conventional prefixes (`feat:`, `test:`, `docs:`, `chore:`, `build:`).

## What Borg JS is

Borg JS is an **educational** JavaScript library whose public functions are **named and documented in Portuguese**. It hides the heavy DOM-control logic so learners can focus on simple reaction logic and on HTML/CSS design. The core feature is making elements react to mouse clicks, buttons and the keyboard in a very short, simple way.

Branding: the logo is a minimalist owl face drawn in SVG, with a gradient from aqua green to sky blue.

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
