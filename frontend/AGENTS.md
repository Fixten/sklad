<!-- agent-md-sync: max-lines=100 -->

Important. Currently project is in outdated state. This is expected. This is not live right now and expects further development.

# frontend

React 19 + Vite SPA, shadcn/ui on Tailwind v4 (CSS-variable theming). Feature-oriented,
mirroring the backend's feature split.

## Conventions

- Feature dir: `<f>.api.ts` (thin wrapper over the `Api` class in `src/api`), `<f>.model.ts`
  (camelCase TS types), `use<F>.ts` (react-query hook), plus the feature's components.
  Pages live in `src/router/pages/<Page>/`.
- `src/components/ui` is shadcn-derived, but most primitives export a **default object of
  namespaced subcomponents** (`Card.Wrapper`, `Item.ItemContent`, `Command.Wrapper`) rather
  than shadcn's flat named exports. Import the default, then dot into it.
- Aliases declared `tsconfig.json`.
- `cn()` (`src/utils/cn.ts`) is `twMerge(clsx(...))` — use it instead of concatenating class
  strings, or conflicting Tailwind utilities survive.
- Icons come from `lucide-react` (see `components.json` → `iconLibrary`).

## Gotchas & decisions

- **`server.js` is the production host**: Express 5 serving static `dist` plus an SPA catch-all
  `app.get('/{*splat}')` (Express 5 renamed `'*'`), run via `pm2-runtime` on `FRONTEND_PORT`.
