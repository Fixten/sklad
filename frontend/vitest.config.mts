import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  envDir: "../",
  resolve: {
    alias: {
      ui: path.resolve(import.meta.dirname, "./src/components/ui"),
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.{test,spec}.ts"],
    coverage: { provider: "v8" },
  },
});
