import { MaterialModel } from "@/features/Material/Material.model";
import useMaterial from "@/features/Material/useMaterial";
import { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import type { Unit } from "@/features/units";

import useVariantData from "./useVariant";
import { VariantModel } from "./Variant.model";

type Mapper<T> = (
  variant: VariantModel,
  material: MaterialModel,
  type: MaterialTypeModel,
) => T;

const getEntry: Mapper<{
  variantId: number;
  materialId: number;
  typeId: number;
}> = (variant, materail, type) => ({
  variantId: variant.id,
  materialId: materail.id,
  typeId: type.id,
});

interface ItemWithName {
  id: number;
  name: string;
}
export interface CatalogItemWithName {
  variant: ItemWithName;
  material: ItemWithName;
  type: ItemWithName;
  unit: Unit;
}

const getEntryWithName: Mapper<CatalogItemWithName> = (
  variant,
  material,
  type,
) => ({
  variant: {
    id: variant.id,
    name: variant.name,
  },
  material: {
    id: material.id,
    name: material.name,
  },
  type: {
    id: type.id,
    name: type.name,
  },
  unit: variant.unit,
});

const getEntryFull: Mapper<{
  variant: VariantModel;
  material: MaterialModel;
  type: MaterialTypeModel;
}> = (variant, material, type) => ({
  variant,
  material,
  type,
});

export default function useVariantsCatalog() {
  const { getMap: getTypeMap, query: typeQuery } = useMaterialType();
  const { getMap: getMaterialMap, query: materialQuery } = useMaterial();
  const { getActiveData, query: variantQuery } = useVariantData();

  function MakeGetCatalog<T>(mapper: Mapper<T>) {
    return () =>
      getActiveData()
        .map((variant) => {
          const material = getMaterialMap().get(variant.material_id);
          if (material) {
            const type = getTypeMap().get(material.material_type_id);
            if (type) {
              return mapper(variant, material, type);
            }
          }
        })
        .filter((v): v is T => !!v);
  }

  return {
    getCatalog: MakeGetCatalog(getEntry),
    getCatalogWithNames: MakeGetCatalog(getEntryWithName),
    getCatalogFull: MakeGetCatalog(getEntryFull),
    getTypeMap,
    getMaterialMap,
    isLoading:
      materialQuery.isLoading || variantQuery.isLoading || typeQuery.isLoading,
  };
}
