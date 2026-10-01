<!-- agent-md-sync: max-lines=30 -->

# Project overview

pnpm monorepo in TypeScript, two packages: `frontend` and `backend`.

# Docs

`docs/INDEX.md` is the entry point; `product/prd/` splits business requirements by concern. Docs are
the source of truth — when they conflict with code, change the code.

# Backend

The API contract is `backend/public/spec.json` (OpenAPI 3.0), generated from the backend code via
`pnpm openapi:generate`. Read that file instead of backend source when working on the frontend.
