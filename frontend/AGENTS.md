<!-- agent-md-sync: max-lines=100 -->

Important. Currently project is in outdated state. This is expected. This is not live right now and expects further development.

# frontend

React 19 + Vite SPA, shadcn/ui on Tailwind v4 (CSS-variable theming). Feature-oriented,
mirroring the backend's feature split.

## Conventions

- Feature dir: `<f>.api.ts` (thin wrapper over the `Api` class in `src/api`), `<f>.model.ts`
  (types derived from `src/api/schema.d.ts`), `use<F>.ts` (react-query hook), plus the
  feature's components. Pages live in `src/router/pages/<Page>/`.
- `src/components/ui` is shadcn-derived, but most primitives export a **default object of
  namespaced subcomponents** (`Card.Wrapper`, `Item.ItemContent`, `Command.Wrapper`) rather
  than shadcn's flat named exports. Import the default, then dot into it.
- Aliases declared `tsconfig.json`.
- `cn()` (`src/utils/cn.ts`) is `twMerge(clsx(...))` — use it instead of concatenating class
  strings, or conflicting Tailwind utilities survive.
- Icons come from `lucide-react` (see `components.json` → `iconLibrary`).

## Adding API integration for a feature

1. Contract first: `backend/public/spec.json` (never backend source), generated via
   `pnpm openapi:generate`. After the spec changes run `pnpm front:api` (root) to
   regenerate `src/api/schema.d.ts` — committed, eslint/prettier-ignored, never edit by hand.
2. `src/features/<F>/`:
   - `<F>.model.ts` — derive from the schema, never hand-write: `components["schemas"]["X"]`
     for the entity, `JsonBody<"/api/<path>", "post">` for the create DTO
     (`src/api/schema-helpers.ts`).
   - `<F>.api.ts` — `private api = new Api("/api/<path>")` (path must be a `paths` key);
     arrow methods delegate to `getAll/get/post/patch/remove`, all typed from the spec.
     Updates are `patch(value, id)` — ids are integers.
   - `use<F>.ts` — module-level api instance; `useQuery({queryKey, queryFn: api.getAll})`
     plus one `useMutation` per write op, `onSuccess: () => query.refetch()`. For
     cross-feature changes use `queryClient.invalidateQueries({queryKey: [...]})` and
     export the query-key const.

## Gotchas & decisions

- **`server.js` is the production host**: Express 5 serving static `dist` plus an SPA catch-all
  `app.get('/{*splat}')` (Express 5 renamed `'*'`), run via `pm2-runtime` on `FRONTEND_PORT`.
