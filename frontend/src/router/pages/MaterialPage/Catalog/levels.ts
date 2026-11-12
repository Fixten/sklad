export const CATALOG_LEVELS = [
  { key: "variants", label: "Варианты" },
  { key: "materials", label: "Материалы" },
  { key: "types", label: "Типы" },
] as const;

export type CatalogLevel = (typeof CATALOG_LEVELS)[number]["key"];

export function parseCatalogLevel(value: string): CatalogLevel {
  const match = CATALOG_LEVELS.find((level) => level.key === value);
  return match?.key ?? "variants";
}
