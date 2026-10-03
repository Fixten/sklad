import { FEATURE_NAMES, FeatureFlags } from "@/config/featureFlags.js";
import DbSingleton from "@/db/index.js";
import { applyMigrations } from "@/db/migrate.js";
import getServer from "@/getServer.js";

export function allFeaturesEnabled(): FeatureFlags {
  return Object.fromEntries(FEATURE_NAMES.map((name) => [name, true]));
}

export function bootstrap(features: FeatureFlags = allFeaturesEnabled()) {
  applyMigrations(DbSingleton.client);
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
