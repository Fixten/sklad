<!-- agent-md-sync: max-lines=120 -->

Important. Currently project is in outdated state. This is expected. This is not live right now and expects further development.

# frontend

React 19 + Vite SPA, shadcn/ui on Tailwind v4 (CSS-variable theming). Feature-oriented,
mirroring the backend's feature split.

## Conventions

- Feature dir: `<f>.api.ts` (thin wrapper over the `Api` class in `src/api`), `<f>.model.ts`
  (types derived from `src/api/schema.d.ts`), `use<F>.ts` (react-query hook), plus the
  feature's components. Pages live in `src/router/pages/<Page>/`.
- **UI component split**: custom, project-authored components live in `src/components/ui/`
  (alias `@ui/*`); shadcn components live in `src/components/ui/base/` (alias `@base/*`) and
  are installed via `shadcn add` (`components.json` sets `aliases.ui = "@base"`). Keep
  upstream code verbatim except for design-driven edits required by `DESIGN.md` (token or
  recipe changes only — e.g. the destructive variant); re-apply those after any reinstall.
- **Import UI only via `@ui/*`.** Code outside `src/components/ui/` must never import
  `@base/*` directly — `@base` is an implementation detail. If `@ui` lacks the piece you
  need, add a `@ui` entry first, even if it is only a re-export.
- Aliases (`tsconfig.json`): `@/*` → `src`; `@ui/*` and `@base/*` as defined above.
- `cn()` from the `cn` package — use it instead of concatenating class strings, or
  conflicting Tailwind utilities survive.
- Use `@ui/Typography` for any text. Base `body` carries `type-body`, so raw `p`/`span`/`div`
  (and reset headings) inherit the body role rather than preflight defaults; `type-*` still wins.
- Icons come from `@ui/Icon`, a re-export of `lucide-react`; only `src/components/ui/**` may
  import `lucide-react` directly (enforced by convention, not lint).
- React Compiler is enabled (`vite.config.mts`); don't hand-memoize with `useMemo`/`useCallback`
  — derived values are auto-memoized (only upstream `@base` code keeps its own).
- Each component should be created in own folder eg /folder/Component/index.tsx
- **Sheet flows**: `useSheetFlow` (`src/lib/sheetFlow.ts`) owns step, failure, busy and async
  transitions; the feature's `flow.ts` owns its `Step` union and back target. A reducer, not
  XState — adopt one only for guards, parallel states or resumable flows.

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
- `vitest.config.mts`: the `tailwindcss()` plugin is duplicated on purpose (browser/vrt render
  unstyled without it), and every dep a test imports belongs in `optimizeDeps.include` — a dep
  discovered mid-run re-optimizes Vite, duplicating React (invalid hook call) and reloading the
  page under the test. Browser/vrt load `src/test/browser.setup.ts` (app CSS, frozen animations).
- `Error` snapshots drop own props (e.g. `ApiError.status`) — snapshot plain fields.
- If vrt testing fails, do not investigate it. Stop to ask user about what you should do with it.

## Gotchas & decisions

- **Dark theme is active — never style from light values.** The app renders dark
  (`.dark` in `src/styles/tailwind.css`); `:root` is unused documentation. Style via
  semantic tokens, never hardcoded or light-derived hex. One hue (forest, H≈131)
  carries surfaces, linework and text; hide browns are defined but unbound.
  Two line weights: `--border` is decoration (1.67:1 on the canvas, 1.40:1 on
  `--card`), and anything that must read as a control edge uses `--control-border`
  (3.96/3.32). Hovers step up the ramp through `--primary-hover` /
  `--destructive-hover` — never `/opacity` on the fill, which darkens it instead.
  `base-*` patches to re-apply after `shadcn add`: destructive = `bg-destructive` +
  `text-destructive-foreground`; the `FieldError` capsule takes the same fill pair
  (the soft `bg-destructive/10 text-destructive` predates it); surfaces carry no
  ring — Card, Dialog and the command list separate by tone step and shadow. Penpot's `Components`
  frame (page `Design system`) is the source of truth for values; its token layer
  and type-binding rules live in `DESIGN.md` §Typography ▸ Penpot.
- **`@base` needs its exact `tsconfig` path entry.** Without the non-wildcard `"@base"`
  mapping (after `@ui/*`), `aliases.ui` resolves to `frontend/@base` instead of
  `src/components/ui/base` — `shadcn add` writes there silently. Confirm with
  `npx shadcn info`.
- **`server.js` is the production host**: Express 5 serving static `dist` plus an SPA catch-all
  `app.get('/{*splat}')` (Express 5 renamed `'*'`), run via `pm2-runtime` on `FRONTEND_PORT`.
- **In Penpot, a token _value_ edit does not re-resolve existing bindings.** Shapes keep the
  colour they resolved at bind time, and re-applying the same token is a no-op — write the new
  value as a literal, re-apply the token, then verify binding _and_ rendered value.
- **`.impeccable/design.json` is generated** from `DESIGN.md` frontmatter plus component
  snippets (impeccable `document`); any token edit in `DESIGN.md` makes the sidecar stale.

## Open threads

- `src/components/ui/base/**` is migrated onto the `type-*` tokens: controls → `type-input`
  (1rem at every breakpoint — the old `text-base … md:text-sm` pair is gone), labels +
  Command shortcut/group heading → `type-label`, titles → `type-title`, all
  copy/descriptions → `type-body`. Raw `tracking-normal`/`normal-case` survive only as
  `Label` peer overrides (`peer-data-[slot=checkbox|radio-group-item|switch]`), which
  `type-body` does not reset. `type-caption` has no slot in `base/**` —
  hints/descriptions are `type-body`.
- `:root` still documents the pre-ladder light palette; light is unshipped, so it was left
  alone. Rebuild it from the forest ladder if a light theme is ever revived.
- `--primary-hover` / `--destructive-hover` are CSS-only state roles — Penpot carries the
  component states, not the roles. They exist so a hover steps up the ramp; don't swap them
  for `/opacity` on the fill.
- The 65ch prose measure lives in the prose slots (`CardDescription`, `DialogDescription`,
  `FieldDescription`, `CommandEmpty`), never on `type-body`: the role also covers
  full-width controls, whose measure comes from their container.
