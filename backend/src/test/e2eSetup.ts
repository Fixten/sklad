import { fileURLToPath } from "node:url";

import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { FEATURE_NAMES, FeatureFlags } from "@/config/featureFlags.js";
import DbSingleton from "@/db/index.js";
import getServer from "@/getServer.js";

const migrationsFolder = fileURLToPath(
  new URL("../../drizzle", import.meta.url),
);

export function allFeaturesEnabled(): FeatureFlags {
  return Object.fromEntries(FEATURE_NAMES.map((name) => [name, true]));
}

export function bootstrap(features: FeatureFlags = allFeaturesEnabled()) {
  migrate(DbSingleton.client, { migrationsFolder });
  return getServer(features);
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
