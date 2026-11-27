import { useState } from "react";

import type { MaterialModel } from "@/features/Material/Material.model";
import useMaterialData from "@/features/Material/useMaterial";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import type { SupplierModel } from "@/features/Supplier/Supplier.model";
import useSupplierData from "@/features/Supplier/useSupplier";
import type { SupplyModel } from "@/features/Supply/Supply.model";
import useSupplyData from "@/features/Supply/useSupply";
import type { Unit } from "@/features/units";
import useVariantData from "@/features/Variant/useVariant";
import type { VariantModel } from "@/features/Variant/Variant.model";
import { supplyStatsByVariant } from "@/router/pages/MaterialPage/Catalog/VariantCards/supplyStats";
import pathsRouter from "@/router/paths.router";

export interface SupplyContext {
  variant?: VariantModel;
  material?: MaterialModel;
  type?: MaterialTypeModel;
  supplier?: SupplierModel;
  unit: Unit;
}

export default function useSuppliesView(variantParam: string | null) {
  const supplies = useSupplyData({});
  const suppliers = useSupplierData();
  const variants = useVariantData();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const [query, setQuery] = useState("");

  const variant = variantParam
    ? variants.getAllData().find((row) => row.id === Number(variantParam))
    : undefined;
  const supplierMap = suppliers.getMap();
  const variantMap = variants.getMap();
  const materialMap = materials.getMap();
  const typeMap = types.getMap();

  function contextOf(supply: SupplyModel): SupplyContext {
    const contextVariant = variantMap.get(supply.material_variant_id);
    const material = contextVariant
      ? materialMap.get(contextVariant.material_id)
      : undefined;
    const supplier =
      supply.supplier_id === undefined || supply.supplier_id === null
        ? undefined
        : supplierMap.get(supply.supplier_id);

    return {
      variant: contextVariant,
      material,
      type: material ? typeMap.get(material.material_type_id) : undefined,
      supplier,
      unit: contextVariant?.unit ?? supply.unit,
    };
  }

  function searchText(supply: SupplyModel, context: SupplyContext): string {
    return [
      supply.description,
      context.supplier?.name,
      context.variant?.name,
      context.material?.name,
      context.type?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  const rows = supplies
    .getActiveData()
    .filter((supply) =>
      variant ? supply.material_variant_id === variant.id : true,
    );
  const items = rows
    .map((supply) => ({ supply, context: contextOf(supply) }))
    .filter((item) =>
      searchText(item.supply, item.context).includes(
        query.trim().toLowerCase(),
      ),
    );
  const stock = variant
    ? (supplyStatsByVariant(rows).get(variant.id)?.stock ?? 0)
    : 0;
  const createTo = variant
    ? `${pathsRouter.supply}?variant=${String(variant.id)}`
    : pathsRouter.supply;

  return {
    items,
    variant,
    stock,
    createTo,
    query,
    setQuery,
    loading:
      supplies.query.isLoading ||
      suppliers.query.isLoading ||
      variants.query.isLoading ||
      materials.query.isLoading ||
      types.query.isLoading,
  };
}
