<!-- agent-md-sync: max-lines=30 -->

# Project overview

pnpm monorepo in TypeScript, three packages: `frontend`, `backend`, and `e2e` (Playwright Test;
see `e2e/AGENTS.md`). Root scripts are thin `pnpm --filter <pkg>` delegates.

# Docs

`docs/INDEX.md` is the entry point; `product/prd/` splits business requirements by concern. Docs are
the source of truth — when they conflict with code, change the code.

# Code style

- Do not use comments in code unless there is extraordinary behavior that is difficult to understand from the code, such as a side effect caused by another component.
- Preffer immutable structures and vars where possible.
- Preffer to declare entities before the first consumtion

# Rules

- User may make changes between your edits, do not revert them.
