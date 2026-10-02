<!-- agent-md-sync: max-lines=120 -->

# backend

Feature-sliced Express 5 + Drizzle/SQLite API. Spec-first: a feature's zod schemas
drive both runtime validation and the generated OpenAPI document.

## Conventions

- Feature dir: `<f>.schema.ts` (Drizzle), `.repository.ts`, `.service.ts`,
  `.router.ts` (thin HTTP mapping), `.zod.ts` (validation source of truth),
  `.openapi.ts` (path registration).
- Modules are mostly classes; prefer composition over inheritance. Reuse the shared
  helpers (`Repository` base class, `createSingleton`) — check an implemented feature
  before hand-rolling.
- Services take deps via constructor injection, wired in `getSingleton`; this is what
  lets unit tests inject mocks.
- A service that needs another feature's data/ops depends on that feature's **service**,
  never its repository (calling it bypasses business logic → duplication). Add a missing
  op to the target service. A service may call its own feature's repository.
- `Repository` is an implementation detail of its own feature's repository file, which
  must explicitly implement every data-access method it uses (even pure proxies:
  `create`, `getById`, `getAllActive`, `update`, `hardDelete`, `softDelete`,
  `getBy<Relation>`). Services and routers never touch a base or foreign repository.
- Soft-delete: rows carry `deleted_at` (NULL = active). Deletion is soft when children
  reference the row, hard when none do. Everything beyond that is in
  `docs/tech/data modeling.md` §26 (deletion strategy) and §34 (validation responsibility).
- Name uniqueness is enforced in the service by checking active siblings; the index only
  backstops a concurrent write, as no case-insensitive index exists.
- DB: snake_case plural tables and columns, FKs `RESTRICT` with enforcement on, no cascades.
- HTTP per resource: `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`. supplier
  and supply currently deviate (update is `POST /:id`, no `GET /:id`) — follow the
  convention for new features.
- Write unit tests for meaningful logic only; pure pass-through wrappers don't need them.
- Lint with `pnpm lint:fix`.

## Gotchas & decisions

- `extendZodWithOpenApi(z)` must run before ANY zod schema is constructed (zod v4). It sits
  at the top of `src/openapi/common.zod.ts`; every other zod file must import it first.
- `*.openapi.ts` files must import only zod schemas/constants — the spec generator loads them
  standalone at build time; a DB/express import breaks generation outside the server lifecycle.
  Register nested paths (e.g. `/:id/restore`) through the `openapi/registry.ts` path builders.
- `localeCompare(..., { sensitivity: "case" })` does NOT fold case in Node's default
  collation (only `"base"` does, and that also folds accents). `isSameName` uses
  `toLowerCase()` for the service-level uniqueness check.
- Unit tests run against a real in-memory database. Real behaviour is lost only where a
  collaborator is mocked, since a mock returns exactly what the test declares: assert
  persistence behaviour at the layer that owns the query, and mock only to exercise the
  calling logic.
- `sendSpec` re-parses the payload it sends, so runtime output must satisfy the documented
  schema — drift fails at the response, not in a type checker.
- DELETE responses are uniform `{ message: "<id> deleted" }` via
  `sendDeleted(res, req.params.id)`. Pass the raw **string** id: `restrict-template-expressions`
  rejects numbers in template literals.
- Error strings come only from the shared errors enum. `errors.middleware.ts` maps
  `SQLITE_CONSTRAINT*`→409, `entity.parse.failed`→400, `ITEM_*_NOT_FOUND`→404. A message
  listed in one of its three arrays is returned verbatim; any other 409 (a raw uniqueness
  violation) falls back to generic `CONFLICT` so DB text never leaks. Add a new domain
  error to the right array — that single list drives both status and body.
- The id param regex must stay flag-free: `zod-to-openapi` emits `regex.toString()` with
  only the slashes stripped, so `/^\d+$/u` ships a `^\d+$/u` pattern that matches nothing.
- Log through `logError` (`src/utils/logger.ts`), never `console.error`. It is silenced
  under `NODE_ENV=test`, which is what keeps deliberately-triggered 409s from spamming e2e output.
- Swagger UI's initializer must reference the standalone `SwaggerUIStandalonePreset` browser
  global (loaded by the package `index.html`). `SwaggerUIBundle.SwaggerUIStandalonePreset` is
  undefined → "No layout defined for StandaloneLayout". swagger-ui-dist Node exports are
  browser UMD globals, not server APIs.
- `Urls` holds prefix-free path segments; build full paths with `getFullPathname(Urls.x)` and
  item paths with `itemPath(Urls.x)`. Change the enum value, not the call sites.
- `public/spec.json` is a static, gitignored artifact written by `scripts/generateOpenApi.ts`
  (root script `pnpm openapi:generate`). The server only serves the existing file — no
  regeneration at start; `/api/docs/spec.json` 404s until you run it after schema/path changes.
  `build` regenerates then `cp -r public build/`.
- Resolve runtime file paths from the module that needs them, never `process.cwd()`. Each module
  declares its own path as a fixed offset from `import.meta.dirname`.
- Root `package.json` scripts are thin delegates (`pnpm --filter backend <script>`); all
  `.env.development` loading belongs in this package's scripts.
- `README.md` documents responsibility, not epics or scope, and names no exact files or URLs
  so it does not go stale.
- `test:all` = `test:unit && test:e2e`; e2e boots the real app against in-memory SQLite
  with migrations applied.

## Open threads

- Routers duplicate the same CRUD scaffolding. Unexplored: a `createCrudRouter` factory;
  blockers are the divergent update verbs above and divergent service method names
  (`get` vs `getById`, `createVariant`/`create`, `hardDelete`).
- `assertUnitChangeAllowed` (materialVariant.service) only checks Supply references;
  Epic 5 Material Usage will have to be consulted there too.
