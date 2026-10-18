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
- Aliases (`tsconfig.json`): `@/*` → `src`; `@ui/*` and `@base/*` as defined above.
- `cn()` from the `cn` package — use it instead of concatenating class strings, or
  conflicting Tailwind utilities survive.
- Type comes only from `@ui/Typography` (`variant` → a `type-*` token in
  `src/styles/tailwind.css`, see `DESIGN.md` §Typography); never raw
  `text-*`/`font-*`/`tracking-*` at call sites. One face: Manrope (`--font-heading`
  == `--font-sans`). `font-mono` is a system stack reserved for shadcn internals
  (`kbd`, code slots) — never use it in project components.
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
- `vitest.config.mts` duplicates the `tailwindcss()` plugin on purpose: without it
  the browser/vrt env renders unstyled and screenshots are meaningless. Browser/vrt
  load `src/test/browser.setup.ts` (imports app CSS, freezes animations).
- `Error` snapshots drop own props (e.g. `ApiError.status`) — snapshot plain fields.
- If vrt testing failes, do not investigate it. Stop to ask user about what you should do with it.

## Gotchas & decisions

- **Dark theme is active — never style from light values.** The app renders dark
  (`.dark` block in `src/styles/tailwind.css`); the `:root` light block is documentation
  only and unused. Style via semantic tokens (`bg-popover`, `text-muted-foreground`, …),
  never hardcoded or light-derived hex. `dark:` overrides are the effective values here,
  so drop them when they only weaken a base value (the `base-*` registry ships a soft
  destructive — `bg-destructive/10 text-destructive` — built for a saturated hue; with the
  brown `--destructive` it was brown-on-brown, now patched to `bg-destructive` +
  `text-destructive-foreground`).
  The `base-*` registry also rings lifted surfaces with a `--foreground` tint
  (5% on Card, 10% on Dialog); per `DESIGN.md` structural linework is
  `--border`, so both are patched to that token — Card at 60%, Dialog at full
  strength.
  The Penpot `Design System — UI Base (shadcn)` frame mirrors `.dark`; its token layer
  and type-binding rules live in `DESIGN.md` §Typography ▸ Penpot.
- **`@base` needs its exact `tsconfig` path entry.** Without the non-wildcard `"@base"`
  mapping (after `@ui/*`), `aliases.ui` resolves to `frontend/@base` instead of
  `src/components/ui/base` — `shadcn add` writes there silently. Confirm with
  `npx shadcn info`.
- **`server.js` is the production host**: Express 5 serving static `dist` plus an SPA catch-all
  `app.get('/{*splat}')` (Express 5 renamed `'*'`), run via `pm2-runtime` on `FRONTEND_PORT`.

## Open threads

- `src/components/ui/base/**` is migrated onto the `type-*` tokens: controls → `type-input`
  (1rem at every breakpoint — the old `text-base … md:text-sm` pair is gone), labels +
  Command shortcut/group heading → `type-label`, titles → `type-title`, all
  copy/descriptions → `type-body`. Raw `tracking-normal`/`normal-case` survive only as
  `Label` peer overrides (`peer-data-[slot=checkbox|radio-group-item|switch]`), which
  `type-body` does not reset. `type-caption` has no slot in `base/**` —
  hints/descriptions are `type-body`.
- The 65ch prose measure is applied in the prose slots (`CardDescription`,
  `DialogDescription`, `FieldDescription`, `CommandEmpty`), never on `type-body`: the
  role also covers full-width controls (command search field), which must keep their box.
- The Penpot canvas still shows the old faces on `Page 1` and `Home — Working Day`
  (~1.2k text layers). The token layer is migrated to Manrope (`typography.*`, no
  typography assets — bind tokens, never a typography asset) and the
  `Design System — UI Base (shadcn)` frame is re-fonted and bound role by role;
  binding the remaining pages is deferred to the `penpot` agent.
