import "dotenv/config";
import { resolve } from "node:path";

import { defineConfig } from "drizzle-kit";

// drizzle-kit transpiles this file to CommonJS, where `import.meta.dirname` is undefined
const { SQLITE } = process.env;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: SQLITE ? resolve(__dirname, SQLITE) : resolve(__dirname, "data"),
  },
});
