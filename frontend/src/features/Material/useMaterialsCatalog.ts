import useMaterialType from "@/features/MaterialType/useMaterialType";
import useVariant from "@/features/Variant/useVariant";

import useMaterial from "./useMaterial";

import type { Unit } from "@/features/units";

export interface MaterialTarget {
  id: number;
  name: string;
  materialTypeName: string;
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
    },
  };
}

export default function useMaterialsCatalog() {
  const material = useMaterial();
  const variant = useVariant();
  const materialType = useMaterialType();

  const types = (materialType.query.data ?? []).filter(
    (row) => !row.deleted_at,
  );
  const materials = (material.query.data ?? []).filter(
    (row) => !row.deleted_at,
  );
  const variants = (variant.query.data ?? []).filter((row) => !row.deleted_at);

  const typeNames = new Map(types.map((type) => [type.id, type.name]));
  const materialById = new Map(
    materials.map((materialRow) => [materialRow.id, materialRow]),
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
    types,
  };
}
