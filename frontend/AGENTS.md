<!-- agent-md-sync: max-lines=120 -->

# frontend

React 19 + Vite SPA, shadcn/ui on Tailwind v4 (CSS-variable theming). Feature-oriented,
mirroring the backend's feature split.

## Conventions

- **Read [code style](docs/code_style.md) before writing code.** It defines judgment rules lint
  cannot check. Standing rule: absence is `undefined`, never `null`, outside API/DOM/`@base`.
- Feature dir: `<f>.api.ts` (thin wrapper over the `Api` class in `src/api`), `<f>.model.ts`
  (types derived from `src/api/schema.d.ts`), `use<F>.ts` (react-query hook), plus the
  feature's components. Pages live in `src/router/pages/<Page>/`.
- **UI component split**: custom, project-authored components live in `src/components/ui/`
  (alias `@ui/*`); shadcn components live in `src/components/ui/base/` (alias `@base/*`),
  installed via `shadcn add` (`components.json` sets `aliases.ui = "@base"`). Keep upstream code
  verbatim except design-driven token/recipe edits from `DESIGN.md` (e.g. the destructive variant).
- **Import UI only via `@ui/*`.** `@base/*` outside `src/components/ui/` is a lint error — add a
  `@ui` entry first if the piece is missing, even if it is only a re-export.
- Aliases (`tsconfig.json`): `@/*` → `src`; `@ui/*`, `@base/*` above. `../` may not leave its
  module (feature, ui component, lib, page) — crossing needs an alias; `./` is always fine.
- Icons come from `@ui/Icon`; only `src/components/ui/**` may import `lucide-react` (lint error
  elsewhere).
- React Compiler is enabled (`vite.config.mts`) — no manual `useMemo`/`useCallback` (upstream
  `@base` excepted).
- **Forms & pending actions**: follow [form conventions](docs/form_conventions.md); busy actions
  use `@ui/Button pending`, never `disabled`. Recipe:
  [DESIGN.md §Separator & Loading](DESIGN.md#separator--loading).
- **Accessibility scope**: keyboard navigation and focus are required; screen-reader support is
  not. Don't add AT-specific machinery for it.

## Adding API integration for a feature

1. Contract first: `backend/public/spec.json` (never backend source), generated via
   `pnpm openapi:generate`. After the spec changes run `pnpm front:api` (root) to
   regenerate `src/api/schema.d.ts` — committed, eslint/prettier-ignored, never edit by hand.
2. `src/features/<F>/`:
   - `<F>.model.ts` — derive from the schema, never hand-write: `components["schemas"]["X"]`
     for the entity, `JsonBody<"/api/<path>", "post">` for the create DTO
     (`src/api/schema-helpers.ts`).
   - `<F>.api.ts` — `private api = new Api("/api/<path>")` (path must be a `paths` key); arrow
     methods delegate to `getAll/get/post/patch/remove`, typed from the spec. `patch(value, id)`.
   - `use<F>.ts` — module-level api instance; `useQuery({queryKey, queryFn: api.getAll})`
     plus one `useMutation` per write op, `onSuccess: () => query.refetch()`. For
     cross-feature changes use `queryClient.invalidateQueries({queryKey: [...]})` and
     export the query-key const.

## Testing

Vitest projects (`vitest.config.mts`): `unit` (`*.test.ts`, node), `browser`
(`*.browser.test.tsx`), `vrt` (`*.vrt.test.tsx`). Scripts: `pnpm test`,
`test:browser` (+`:install` for chromium), `vrt` / `vrt:update`;
`test:all`/`fullcheck` run all three.

- Explicit imports (`globals: false`) — import `test`/`expect`/`vi` from `vitest`;
  `render` from `vitest-browser-react` returns a **Promise** (await it).
- Snapshots: value via `toMatchSnapshot`/`toMatchInlineSnapshot` (`__snapshots__`
  committed); a11y via `toMatchAriaInlineSnapshot` on `expect.element(locator)`;
  visual via `toMatchScreenshot` (`__screenshots__` committed, `-chromium-linux`
  suffixed — regenerate with `vrt:update` on the target environment).
- API stubs: `createApiStub` (`src/test/apiStub.ts`) returns typed `{ fetch, requests }`;
  Vitest's `stubRoutes` (`src/test/apiStub.vitest.ts`) installs it. Exact paths win over `{id}`
  templates (`/api/x/{id}`, `restore/{id}`, `stock/{id}`); handlers return data/Promise or
  `errorResponse(status, msg)`. Request logs include `path`, `search`, `method`, `body`; unrouted
  calls fail. Keep fixtures shared outside Vitest-only render helpers when Storybook needs them.
  Don't `vi.mock` `*.api.ts` (loses request-body assertions and error mapping); MSW deferred.
- `vitest.config.mts`: the `tailwindcss()` plugin is duplicated on purpose (browser/vrt render
  unstyled without it), and every dep a test imports belongs in `optimizeDeps.include` — a dep
  discovered mid-run re-optimizes Vite, duplicating React (invalid hook call) and reloading the
  page under the test. Browser/vrt load `src/test/browser.setup.ts` (app CSS, frozen animations, unstub after each test).
- `Error` snapshots drop own props (e.g. `ApiError.status`) — snapshot plain fields.
- If vrt testing fails, do not investigate it. Stop to ask user about what you should do with it.

## Gotchas & decisions

- **Dark theme is active — never style from light values.** The app renders dark
  (`.dark` in `src/styles/tailwind.css`); `:root` documents the unused light palette. Style via
  semantic tokens, never hardcoded or light-derived hex. One hue (forest, H≈131)
  carries surfaces, linework and text; hide browns are defined but unbound.
  Two line weights: `--border` is decoration (1.67:1 on the canvas, 1.40:1 on
  `--card`), and anything that must read as a control edge uses `--control-border`
  (3.96/3.32). Hovers step up the ramp through `--primary-hover` / `--destructive-hover`
  (CSS-only roles; Penpot has states, not these roles) — never `/opacity` on the fill.
  `base-*` patches to re-apply after `shadcn add`: destructive = `bg-destructive` +
  `text-destructive-foreground`; the `FieldError` capsule takes the same fill pair
  (the soft `bg-destructive/10 text-destructive` predates it); surfaces carry neither
  ring nor shadow, separating by tone step alone. Penpot's `Components`
  frame (page `Design system`) is the source of truth for values; its token layer
  and type-binding rules live in `DESIGN.md` §Typography ▸ Penpot.
- **`@base` needs its exact `tsconfig` path entry.** Without the non-wildcard `"@base"`
  mapping (after `@ui/*`), `aliases.ui` resolves to `frontend/@base` instead of
  `src/components/ui/base` — `shadcn add` writes there silently. Confirm with
  `npx shadcn info`.
- **Relative imports are module-scoped** by `local/same-module-relative-import`: don't swap it
  for `import-x/no-relative-parent-imports` (resolves the alias, then reports `@/…`), and keep
  globs `**/`-prefixed — pre-commit lints from the repo root. `src/config/features.ts` is exempt.
- **`server.js` is the production host**: Express 5 serving static `dist` plus an SPA catch-all
  `app.get('/{*splat}')` (Express 5 renamed `'*'`), run via `pm2-runtime` on `FRONTEND_PORT`.
- **In Penpot, a token _value_ edit does not re-resolve existing bindings.** Shapes keep the
  colour they resolved at bind time, and re-applying the same token is a no-op — write the new
  value as a literal, re-apply the token, then verify binding _and_ rendered value.
- **`.impeccable/design.json` is generated** from `DESIGN.md` frontmatter plus component
  snippets (impeccable `document`); any token edit in `DESIGN.md` makes the sidecar stale.

## Open threads

- `base/**` uses `type-*`: controls → `type-input`, labels/shortcuts → `type-label`, titles →
  `type-title`, copy/hints → `type-body`; no `type-caption`. `tracking-normal`/`normal-case`
  survive only as Label peer overrides for checkbox/radio/switch.
- The 65ch prose measure lives in the prose slots (`CardDescription`, `DialogDescription`,
  `FieldDescription`, `CommandEmpty`), never on `type-body`: the role also covers
  full-width controls, whose measure comes from their container.
