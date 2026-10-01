import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const FEATURES_CONFIG_PATH = join(
  process.cwd(),
  "..",
  "features.config.json",
);

export function readFeatureFlags(
  configPath: string = FEATURES_CONFIG_PATH,
): Record<string, unknown> {
  try {
    if (!existsSync(configPath)) return {};
    const parsed: unknown = JSON.parse(readFileSync(configPath, "utf-8"));
    if (typeof parsed !== "object" || parsed === null) return {};
    const features: unknown = (parsed as { features?: unknown }).features;
    if (typeof features !== "object" || features === null) return {};
    return features as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function isFeatureEnabled(
  name: string,
  features: Record<string, unknown> = readFeatureFlags(),
): boolean {
  if (!Object.prototype.hasOwnProperty.call(features, name)) return true;
  return typeof features[name] === "boolean" ? features[name] : true;
}
