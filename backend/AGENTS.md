<!-- agent-md-sync: max-lines=120 -->

# backend

Feature-sliced Express 5 + Drizzle/SQLite API. Spec-first: a feature's zod schemas
drive both runtime validation and the generated OpenAPI document.

## Conventions

- Feature dir: `<f>.schema.ts` (Drizzle), `.repository.ts`, `.service.ts`, `.router.ts` (thin HTTP
  mapping), `.zod.ts` (validation source of truth), `.openapi.ts` (path registration).
- Modules are mostly classes; prefer composition over inheritance. Reuse the shared helpers
  (`Repository` base class, `createSingleton`) — check an implemented feature before hand-rolling.
- Services take deps via constructor injection, wired in `getSingleton`, which is what lets unit
  tests inject mocks.
- A service needing another feature's data/ops depends on that feature's **service**, never its
  repository (calling it bypasses business logic → duplication). Add a missing op to the target
  service; a service may call its own feature's repository. Cross-feature service imports run one
  way only — `materialType → material → materialVariant → supply`, plus `supplier → supply`
  (importer → imported); reasoning in `docs/tech/architecture.md` §5.
- `Repository` is an implementation detail of its own feature's repository file, which must
  explicitly implement every data-access method it uses (even pure proxies: `create`, `getById`,
  `getAllActive`, `update`, `hardDelete`, `softDelete`, `getBy<Relation>`). Services and routers
  never touch a base or foreign repository.
- Soft-delete: rows carry `deleted_at` (NULL = active). Deletion is soft when children reference
  the row, hard when none do. See `docs/tech/data modeling.md` §26 (deletion strategy), §34
  (validation responsibility).
- Name uniqueness is enforced in the service by checking active siblings; the index only backs up
  a concurrent write, as no case-insensitive index exists.
- DB: snake_case plural tables/columns, FKs `RESTRICT` with enforcement on, no cascades.
- HTTP per resource: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`, plus
  `POST /:id/restore` for soft-deletable ones. Follow the convention for new features.
- Unit test meaningful logic only; pure pass-through wrappers don't need tests.
- Lint with `pnpm lint:fix`.

## Gotchas & decisions

- `extendZodWithOpenApi(z)` must run before ANY zod schema is constructed (zod v4). It sits at the
  top of `src/openapi/common.zod.ts`; every other zod file must import it first.
- `*.openapi.ts` files must import only zod schemas/constants — the spec generator loads them
  standalone, so a DB/express import breaks generation. Register nested paths (e.g.
  `/:id/restore`) through the `openapi/registry.ts` path builders.
- `localeCompare(..., { sensitivity: "case" })` does NOT fold case in Node's default collation
  (only `"base"` does, and it folds accents too). `isSameName` uses `toLowerCase()` instead.
- Unit tests run against a real in-memory database. Real behaviour is lost only where a collaborator
  is mocked, since a mock returns exactly what the test declares: assert persistence at the layer
  that owns the query, and mock only to exercise the calling logic.
- `sendSpec` re-parses the payload it sends, so runtime output must satisfy the documented
  schema — drift fails at the response, not in a type checker.
- DELETE responses are uniform `{ message: "<id> deleted" }` via `sendDeleted(res, req.params.id)`.
  Pass the raw **string** id: `restrict-template-expressions` rejects numbers in template literals.
- Error strings come only from the shared errors enum. `errors.middleware.ts` maps
  `SQLITE_CONSTRAINT*`→409, `entity.parse.failed`→400, `ITEM_*_NOT_FOUND`→404; a message in one of
  its three arrays is verbatim, any other 409 falls back to generic `CONFLICT` so DB text never
  leaks. That single list drives both status and body — add a new domain error to the right array.
- The id param regex must stay flag-free: `zod-to-openapi` emits `regex.toString()` with only the
  slashes stripped, so `/^\d+$/u` ships a `^\d+$/u` pattern that matches nothing.
- Log through `Logger.error` / `Logger.log` (`src/utils/logger.ts`), never `console.error`; both
  are silenced under `NODE_ENV=test`, which keeps deliberate 409s out of e2e output.
- Swagger UI's initializer must reference the standalone `SwaggerUIStandalonePreset` browser global
  (loaded by the package `index.html`); the `SwaggerUIBundle` one is undefined → "No layout defined
  for StandaloneLayout". swagger-ui-dist Node exports are browser UMD globals, not server APIs.
- `Urls` holds prefix-free path segments; build paths with `getFullPathname(Urls.x)` and item paths
  with `itemPath(Urls.x)`. Change the enum value, not the call sites.
- `public/spec.json` is a static, gitignored artifact written by `scripts/generateOpenApi.ts`
  (root `pnpm openapi:generate`). The server only serves the existing file, never regenerating at
  start, so `/api/docs/spec.json` 404s until you run it after schema/path changes. `build`
  regenerates then `cp -r public build/`.
- Resolve runtime file paths from the module that needs them, never `process.cwd()`: each module
  declares its own path as a fixed offset from `import.meta.dirname`.
- Root `package.json` scripts are thin delegates (`pnpm --filter backend <script>`); all
  `.env.development` loading belongs in this package's scripts.
- `README.md` documents responsibility, not scope and no exact files or URLs, so it cannot go stale.
- A feature needing one row of another feature's table for validation adds a projection method to
  **its own** repository, not the foreign repository or service.
