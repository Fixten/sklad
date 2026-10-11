import path from "node:path";

import { defineConfig } from "@playwright/test";
import { config as loadEnv } from "dotenv";

const root = path.resolve(import.meta.dirname, "..");
loadEnv({ path: path.join(root, ".env.e2e") });

const backendPort = process.env.BACKEND_PORT ?? "1200";
const frontendPort = "5273";
const apiUrl = `http://localhost:${backendPort}/api`;
const frontendUrl = `http://localhost:${frontendPort}`;

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: frontendUrl,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm --filter backend server:e2e",
      url: apiUrl,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --filter frontend server:e2e",
      url: frontendUrl,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
