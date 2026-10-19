import featuresConfig from "../../../features.config.json";

export const FEATURE_NAMES = [
  "settings",
  "materialType",
  "materialVariant",
  "material",
  "supply",
  "supplier",
] as const;

export type FeatureName = (typeof FEATURE_NAMES)[number];

export type FeatureFlags = Partial<Record<FeatureName, unknown>>;

export function isFeatureEnabled(
  name: FeatureName,
  features: FeatureFlags = featuresConfig.features,
): boolean {
  return features[name] !== false;
}
