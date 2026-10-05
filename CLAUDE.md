# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

There is no source code, `package.json`, build tooling or git repository yet. The repo has only specs and workflow rules. When the first spec is executed, update this file with the real build, lint and test commands, including how to run a single test.

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
