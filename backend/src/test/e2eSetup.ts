import { fileURLToPath } from "node:url";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import DbSingleton from "@/db/index.js";
import getServer from "@/getServer.js";

const migrationsFolder = fileURLToPath(
  new URL("../../drizzle", import.meta.url),
);

export function bootstrap() {
  migrate(DbSingleton.client, { migrationsFolder });
  return getServer();
}

export function truncate() {
  DbSingleton.base?.exec(`
    DELETE FROM supply;
    DELETE FROM material_variants;
    DELETE FROM materials;
    DELETE FROM material_types;
    DELETE FROM supplier;
    DELETE FROM settings;
    DELETE FROM sqlite_sequence;
  `);
}