import { useState } from "react";

import useMaterial from "@/features/Material/useMaterial";
import { typeNamesById } from "@/features/MaterialType/MaterialType.utils";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useVariantsCatalog from "@/features/Variant/useVariantsCatalog";
import Card from "@ui/Card";
import SelectField from "@ui/SelectField";
import Typography from "@ui/Typography";

import { CATALOG_LEVELS, parseCatalogLevel, type CatalogLevel } from "./levels";

const levelOptions = CATALOG_LEVELS.map(({ key, label }) => ({
  value: key,
  label,
}));

interface CatalogSources {
  variantRows: Awaited<ReturnType<typeof useVariantsCatalog>>["rows"];
  materials: ReturnType<typeof useMaterial>["materials"];
  activeTypes: ReturnType<typeof useMaterialType>["types"];
  allTypes: ReturnType<typeof useMaterialType>["types"];
}

interface CatalogCardData {
  key: string | number;
  title: string;
  description?: string;
  context?: string;
}

function catalogCards(
  level: CatalogLevel,
  sources: CatalogSources,
): CatalogCardData[] {
  switch (level) {
    case "variants":
      return sources.variantRows.map((row) => ({
        key: row.variantId,
        title: row.variantName,
        description: [row.material.name, row.material.materialTypeName]
          .filter(Boolean)
          .join(" · "),
      }));
    case "materials":
      return sources.materials.map((material) => ({
        key: material.id,
        title: material.name,
        description: material.description ?? undefined,
        context: typeNamesById(sources.allTypes).get(material.material_type_id),
      }));
    case "types":
      return sources.activeTypes.map((type) => ({
        key: type.id,
        title: type.name,
        description: type.description ?? undefined,
      }));
  }
}

export default function MaterialCatalog() {
  const [level, setLevel] = useState<CatalogLevel>("variants");

  const { rows: variantRows, isLoading: variantsLoading } =
    useVariantsCatalog();
  const { materials, query: materialQuery } = useMaterial();
  const { types, query: typeQuery } = useMaterialType();
  const { query: allTypesQuery } = useMaterialType({ hidden: true });

  const cards = catalogCards(level, {
    variantRows,
    materials,
    activeTypes: types,
    allTypes: allTypesQuery.data ?? [],
  });

  const isLoading =
    variantsLoading ||
    materialQuery.isLoading ||
    typeQuery.isLoading ||
    allTypesQuery.isLoading;

  return (
    <div className="flex flex-col gap-4">
      <SelectField
        label="Уровень"
        options={levelOptions}
        value={level}
        onValueChange={(value) => setLevel(parseCatalogLevel(value))}
      />
      <div data-testid="material-catalog-list" className="flex flex-col gap-4">
        {!isLoading && cards.length === 0 ? (
          <Typography
            data-testid="material-catalog-empty"
            variant="caption"
            className="text-muted-foreground"
          >
            Каталог пуст
          </Typography>
        ) : (
          cards.map(({ key, context, ...card }) => (
            <Card key={key} {...card}>
              {context ? (
                <Typography variant="caption" className="text-muted-foreground">
                  {context}
                </Typography>
              ) : null}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
