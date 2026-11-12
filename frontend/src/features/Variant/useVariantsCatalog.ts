import useMaterial from "@/features/Material/useMaterial";
import { typeNamesById } from "@/features/MaterialType/MaterialType.utils";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import type { Unit } from "@/features/units";

import useVariant from "./useVariant";

export interface MaterialTarget {
  id: number;
  name: string;
  materialTypeName: string;
  materialTypeId: number;
}

export interface MaterialCatalogRow {
  variantId: number;
  variantName: string;
  unit: Unit;
  material: MaterialTarget;
}

export function buildMaterialCatalogRow(
  variant: { id: number; name: string; unit: Unit; material_id: number },
  material: { id: number; name: string; material_type_id: number },
  typeName: string,
): MaterialCatalogRow {
  return {
    variantId: variant.id,
    variantName: variant.name,
    unit: variant.unit,
    material: {
      id: material.id,
      name: material.name,
      materialTypeName: typeName,
      materialTypeId: material.material_type_id,
    },
  };
}

export default function useVariantsCatalog() {
  const { rows: materialRows, query: materialQuery } = useMaterial();
  const { variants, query: variantQuery } = useVariant();
  const { rows: typeRows, query: typeQuery } = useMaterialType();

  const typeNames = typeNamesById(typeRows);
  const materialById = new Map(
    materialRows.map((materialRow) => [materialRow.id, materialRow]),
  );

  const rows = variants.flatMap((variantRow) => {
    const materialRow = materialById.get(variantRow.material_id);

    if (!materialRow) return [];

    return [
      buildMaterialCatalogRow(
        variantRow,
        materialRow,
        typeNames.get(materialRow.material_type_id) ?? "",
      ),
    ];
  });

  return {
    rows,
    isLoading:
      materialQuery.isLoading || variantQuery.isLoading || typeQuery.isLoading,
  };
}
