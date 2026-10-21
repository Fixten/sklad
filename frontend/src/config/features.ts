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

export function areFeaturesEnabled(
  names: readonly FeatureName[],
  features: FeatureFlags = featuresConfig.features,
): boolean {
  return names.every((name) => isFeatureEnabled(name, features));
}

export const MATERIAL_FEATURES = [
  "materialType",
  "materialVariant",
  "material",
] as const satisfies readonly FeatureName[];

export function isMaterialEnabled(
  features: FeatureFlags = featuresConfig.features,
): boolean {
  return areFeaturesEnabled(MATERIAL_FEATURES, features);
}
