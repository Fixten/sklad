import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { getSqlitePath } from "./src/db/createSqlite";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: getSqlitePath(),
  },
});
