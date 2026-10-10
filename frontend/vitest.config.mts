import path from "path";

import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  envDir: "../",
  plugins: [react()],
  resolve: {
    alias: {
      ui: path.resolve(import.meta.dirname, "./src/components/ui"),
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["src/**/*.{test,spec}.ts"],
        },
      },
      {
        test: {
          name: "browser",
          include: ["src/**/*.browser.{test,spec}.tsx"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
    coverage: { provider: "v8" },
  },
});
