export const CATALOG_LEVELS = [
  { key: "materials", label: "Материалы" },
  { key: "variants", label: "Варианты" },
  { key: "types", label: "Типы" },
] as const;

export type CatalogLevel = (typeof CATALOG_LEVELS)[number]["key"];

export function parseCatalogLevel(value: string): CatalogLevel {
  const match = CATALOG_LEVELS.find((level) => level.key === value);
  return match?.key ?? "materials";
}
