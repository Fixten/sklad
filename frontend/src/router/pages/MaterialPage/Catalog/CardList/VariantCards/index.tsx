import type { MaterialModel } from "@/features/Material/Material.model";
import useMaterialData from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import useSupplyData from "@/features/Supply/useSupply";
import useVariantData from "@/features/Variant/useVariant";
import type { VariantModel } from "@/features/Variant/Variant.model";

import CardGrid from "../CardGrid";
import CatalogCard from "../CatalogCard";
import VariantCardContent from "../CatalogCard/VariantCardContent";

import { supplyStatsByVariant } from "./supplyStats";

interface Props {
  query: string;
  showHidden: boolean;
}

export default function VariantCards(props: Props) {
  const variants = useVariantData();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const supplies = useSupplyData({});
  const query = props.query.trim().toLowerCase();
  const materialMap = materials.getMap();
  const typeMap = types.getMap();
  const supplyStats = supplyStatsByVariant(supplies.getAllData());
  const materialOf = (variant: VariantModel) =>
    materialMap.get(variant.material_id);
  const typeOf = (material?: MaterialModel) =>
    material ? typeMap.get(material.material_type_id) : undefined;
  const searchText = (variant: VariantModel) => {
    const material = materialOf(variant);
    return [variant.name, material?.name, typeOf(material)?.name]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };
  const rows = props.showHidden
    ? variants.getAllData()
    : variants.getActiveData();
  const visible = rows.filter((variant) => searchText(variant).includes(query));

  return (
    <CardGrid
      loading={
        variants.query.isLoading ||
        materials.query.isLoading ||
        types.query.isLoading ||
        supplies.query.isLoading
      }
      count={visible.length}
    >
      {visible.map((variant) => {
        const material = materialOf(variant);
        const stats = supplyStats.get(variant.id);
        return (
          <CatalogCard
            key={variant.id}
            title={variant.name}
            content={
              <VariantCardContent
                variant={variant}
                material={material}
                type={typeOf(material)}
                stock={stats?.stock ?? 0}
                lastSupply={stats?.lastSupply}
              />
            }
          />
        );
      })}
    </CardGrid>
  );
}
