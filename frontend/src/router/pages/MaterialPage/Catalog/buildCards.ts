import useMaterial from "@/features/Material/useMaterial";
import { typeNamesById } from "@/features/MaterialType/MaterialType.utils";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useVariantsCatalog from "@/features/Variant/useVariantsCatalog";

import { type CatalogLevel } from "./levels";

interface CatalogSources {
  variantRows: Awaited<ReturnType<typeof useVariantsCatalog>>["rows"];
  materials: ReturnType<typeof useMaterial>["materials"];
  activeTypes: ReturnType<typeof useMaterialType>["types"];
  allTypes: ReturnType<typeof useMaterialType>["types"];
}

export interface CatalogCardData {
  key: string | number;
  title: string;
  description?: string;
  context?: string;
  searchableText: string;
}

export function buildCards(
  level: CatalogLevel,
  sources: CatalogSources,
): CatalogCardData[] {
  const typeNames = typeNamesById(sources.allTypes);

  switch (level) {
    case "variants":
      return sources.variantRows.map((row) => ({
        key: row.variantId,
        title: row.variantName,
        description: [row.material.name, row.material.materialTypeName]
          .filter(Boolean)
          .join(" · "),
        searchableText: [
          row.variantName,
          row.material.name,
          row.material.materialTypeName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      }));
    case "materials":
      return sources.materials.map((material) => {
        const typeName = typeNames.get(material.material_type_id);

        return {
          key: material.id,
          title: material.name,
          description: material.description ?? undefined,
          context: typeName,
          searchableText: [material.name, typeName ?? ""]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      });
    case "types":
      return sources.activeTypes.map((type) => ({
        key: type.id,
        title: type.name,
        description: type.description ?? undefined,
        searchableText: type.name.toLowerCase(),
      }));
  }
}
