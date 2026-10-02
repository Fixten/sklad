import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { logError } from "@/utils/logger.js";

const featuresConfigPath = join(
  import.meta.dirname,
  "../../../features.config.json",
);

export const FEATURE_NAMES = [
  "settings",
  "materialType",
  "materialVariant",
  "material",
  "supply",
  "supplier",
] as const;

type FeatureName = (typeof FEATURE_NAMES)[number];

export type FeatureFlags = Partial<Record<FeatureName, unknown>>;

export function readFeatureFlags(
  configPath: string = featuresConfigPath,
): FeatureFlags {
  if (existsSync(configPath)) {
    try {
      const parsed = JSON.parse(readFileSync(configPath, "utf-8")) as unknown;
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "features" in parsed
      ) {
        return parsed.features ?? {};
      }
    } catch {
      logError(`Failed to read feature flags from ${configPath}, ignoring`);
    }
  }
  return {};
}
