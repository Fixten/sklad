import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  envDir: "../",
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      "@base-ui/react/dialog",
      "@base-ui/react/select",
      "@hookform/resolvers/zod",
      "@tanstack/react-query",
      "cmdk",
      "lucide-react",
      "react-hook-form",
      "react-router",
      "zod",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@ui": path.resolve(import.meta.dirname, "./src/components/ui"),
      "@base": path.resolve(import.meta.dirname, "./src/components/ui/base"),
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
          setupFiles: ["./src/test/browser.setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        test: {
          name: "vrt",
          include: ["src/**/*.vrt.test.tsx"],
          setupFiles: ["./src/test/browser.setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [
              { browser: "chromium", viewport: { width: 1440, height: 900 } },
            ],
            expect: {
              toMatchScreenshot: {
                comparatorName: "pixelmatch",
                comparatorOptions: { allowedMismatchedPixelRatio: 0.01 },
              },
            },
          },
        },
      },
    ],
    coverage: { provider: "v8" },
  },
});
