import { normalizeName } from "@/lib/text/text";

import type {
  MaterialCatalogRow,
  MaterialTarget,
} from "@/features/Material/useMaterialsCatalog";

export type CreationTarget =
  { kind: "variant"; material: MaterialTarget } | { kind: "material" };

export function materialPath(material: MaterialTarget) {
  return material.materialTypeName
    ? `${material.materialTypeName} › ${material.name}`
    : material.name;
}

export function materialTitle(material: MaterialTarget) {
  return material.materialTypeName
    ? `${material.materialTypeName} · ${material.name}`
    : material.name;
}

export function matchRows(
  rows: MaterialCatalogRow[],
  query: string,
): MaterialCatalogRow[] {
  const needle = normalizeName(query);

  if (!needle) return [];

  return rows.filter((row) =>
    [row.variantName, row.material.name, row.material.materialTypeName].some(
      (value) => normalizeName(value).includes(needle),
    ),
  );
}

export function resolveCreationTarget(
  rows: MaterialCatalogRow[],
  query: string,
): CreationTarget | null {
  const name = query.trim();

  if (!name) return null;

  const matched = matchRows(rows, query);
  const source =
    matched.find(
      (row) => normalizeName(row.material.name) === normalizeName(name),
    ) ?? matched[0];

  if (!source) return { kind: "material" };

  return { kind: "variant", material: source.material };
}
