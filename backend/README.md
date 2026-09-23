# Sklad backend

REST API for Sklad — a small-business management application for materials, products, production, inventory, and sales.

> Product and technical requirements live in the repository `docs` folder.

## Responsibility

This package is the **backend of Sklad**. It:

- exposes a REST API consumed by the frontend SPA;
- is the source of truth for business rules and validation;
- persists data to SQLite through Drizzle ORM using a soft-delete model (`deleted_at` is `NULL` when the record is active);
- generates an OpenAPI 3.0 specification from the same zod schemas used for runtime request/response validation;
- serves an interactive Swagger UI.

The API is organized around the material catalog (Material Types, Materials, Material Variants), Supplies and Suppliers, and application Settings (labor cost).

## Tech stack

| Area | Technology |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Web framework | Express 5 |
| Validation / schemas | zod |
| OpenAPI generation | `@asteasolutions/zod-to-openapi` |
| Swagger UI assets | `swagger-ui-dist` |
| Database | SQLite (`better-sqlite3`) |
| ORM | Drizzle |
| Process manager | pm2 |
| Dev runner | tsx |
| Tests | jest + supertest |

## Main entities

```text
Material Type ──< Material ──< Material Variant ──< Supply ── Supplier
Settings (single labor cost)
```

- **Material Type** — classification of materials.
- **Material** — belongs to a Material Type.
- **Material Variant** — a specific version of a Material (e.g. a color) and owns the unit (`pieces` or `meters`). The unit is immutable after historical usage.
- **Supply** — a purchased quantity of a Material Variant; stock and unit cost are derived from it.
- **Supplier** — a separate managed entity referenced by Supplies.
- **Settings** — the single configured hourly labor cost.

Soft deletion is used for entities that keep historical relationships: Material Types, Materials, Material Variants, Supplies, and Suppliers.

The API is intentionally REST-oriented and feature-based: business rules live in services, persistence in repositories, HTTP mapping in thin routers, and validation in zod schemas shared with the OpenAPI spec.

## Project structure

```text
src/
├── db/            Drizzle schema, SQLite connection, migrations entry points
├── features/      one directory per feature
│   ├── schema     Drizzle table definition
│   ├── repository persistence operations
│   ├── service    business logic
│   ├── router     HTTP routes
│   ├── zod        validation schemas (source of truth)
│   └── openapi    OpenAPI path registration
├── openapi/       spec generation, validation middleware, Swagger UI wiring
├── constants/     shared constants (URLs, error messages)
├── utils/         generic helpers
└── test/          unit and e2e tests
```

## Configuration

The application reads configuration from environment variables:

| Variable | Purpose |
|---|---|
| `SQLITE` | Path to the SQLite database file |
| `BACKEND_PORT` | HTTP port the API listens on |

The app refuses to start when `BACKEND_PORT` is not set. Dev scripts marked `:dev` load a repository-level development env file automatically. In prod the env vars must be provided by the environment.

## Fresh setup

```bash
pnpm install
pnpm start:dev
```

The first run applies no migrations automatically — apply them explicitly (dev environment):

```bash
pnpm migration:apply:dev
```

## Run in dev

```bash
pnpm start:dev
```

The server automatically restarts on file changes (tsx watch).

## Run in prod

```bash
pnpm build
pnpm prod
```

`build` compiles TypeScript into a build output directory; `prod` runs the compiled app with pm2, expecting that build output to exist.

## Tests

```bash
pnpm test:all      # unit + e2e, one run
pnpm test:watch    # unit tests in watch mode
pnpm test:unit     # unit tests only, one run
pnpm test:e2e      # e2e tests only, one run
```

- Unit tests cover repositories and services with mocked dependencies.
- E2E tests bootstrap the real Express app with an in-memory SQLite database (migrations applied automatically) and exercise the HTTP API with supertest.

## Lint and typecheck

```bash
pnpm lint
pnpm lint:fix
pnpm typecheck
```

## Migrations and database tooling

```bash
pnpm migration:generate    # generate a migration from schema changes (dev)
pnpm migration:apply       # apply migrations (env must provide SQLITE)
pnpm migration:apply:dev   # apply migrations loading dev environment
pnpm studio                # Drizzle Studio for inspecting the database (dev)
```

## OpenAPI / Swagger

Start the server, then open the interactive UI in a browser. The app exposes Swagger UI under a single API URL prefix, together with the raw OpenAPI spec JSON referenced by the UI.

The spec is generated from the zod schemas:

- Features define strict request/response zod schemas that are reused by the router middleware at runtime, so the documented contract always matches what the API validates.
- Feature-level OpenAPI modules register paths and reference those schemas.
- A central document assembler produces the final spec; Swagger UI assets and an initializer that points at the spec JSON are served by the app.
- Error responses use a shared error-response schema.

All API routes are mounted under a single shared prefix, including the docs/UI routes.