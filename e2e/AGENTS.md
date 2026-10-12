<!-- agent-md-sync: max-lines=60 -->

# e2e

Playwright Test suite driving the real frontend + backend in a browser (`e2e` workspace package).
Started from root with `pnpm e2e` / `pnpm e2e:ui`; intentionally **not** in `fullcheck`, no CI.

## Conventions

- `.env.e2e` (root, committed) is the single source of e2e env; `playwright.config.ts` loads it with
  dotenv, so both spawned servers inherit `NODE_ENV=test` / `BACKEND_PORT`.
- `webServer` boots both through their dotenv-free `server:e2e` scripts: backend
  `tsx src/test/e2eServer.ts`, frontend `vite --mode e2e` (Vite also loads `.env.e2e` itself).
- Backend `server:e2e` reuses `src/test/e2eSetup.ts#bootstrap` (in-process migrate + all features)
  then listens; `NODE_ENV=test` → in-memory SQLite and silenced logs.
- Ports isolated from dev: backend `1200`, frontend `5273`. Serial run (`workers: 1`).
- Use `127.0.0.1`, **not `localhost`**, in the Playwright `request` fixture: under WSL
  `APIRequestContext` hangs on `localhost` (hits the request timeout) while `127.0.0.1`/`[::1]`
  answer in ~10ms. Chromium (`page.goto`) is unaffected.
