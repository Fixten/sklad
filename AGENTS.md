<!-- agent-md-sync: max-lines=30 -->

# Project overview

pnpm monorepo in TypeScript, two packages: `frontend` and `backend`.

# Docs

`docs/INDEX.md` is the entry point; `product/prd/` splits business requirements by concern. Docs are
the source of truth — when they conflict with code, change the code.

# Backend

The API contract is `backend/public/spec.json` (OpenAPI 3.0), generated from the backend code via
`pnpm openapi:generate`. Read that file instead of backend source when working on the frontend.

# Code style

- Do not use comments in code unless there is extraordinary behavior that is difficult to understand from the code, such as a side effect caused by another component.
- Preffer immutable structures and vars where possible.
- Preffer to declare entities before the first consumtion
