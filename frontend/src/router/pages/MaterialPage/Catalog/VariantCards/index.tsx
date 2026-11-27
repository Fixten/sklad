import { generatePath } from "react-router";

import type { MaterialModel } from "@/features/Material/Material.model";
import useMaterialData from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import useSupplyData from "@/features/Supply/useSupply";
import useVariantData, {
  useVariantMutations,
} from "@/features/Variant/useVariant";
import type { VariantModel } from "@/features/Variant/Variant.model";
import pathsRouter from "@/router/paths.router";
import { toastSuccess } from "@ui/Toast";

import EntityActions from "../../EntityActions";
import CardGrid from "../CardGrid";
import CatalogCard from "../CatalogCard";
import VariantCardContent from "../CatalogCard/VariantCardContent";

import { supplyStatsByVariant } from "./supplyStats";

interface Props {
  query: string;
  showHidden: boolean;
  materialId?: number;
}

export default function VariantCards(props: Props) {
  const variants = useVariantData();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const supplies = useSupplyData({});
  const mutations = useVariantMutations();
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
  const visible = rows.filter(
    (variant) =>
      (props.materialId === undefined ||
        variant.material_id === props.materialId) &&
      searchText(variant).includes(query),
  );

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
        const hidden = !!variant.deleted_at;
        return (
          <CatalogCard
            key={variant.id}
            title={variant.name}
            to={generatePath(pathsRouter.materialVariant, {
              id: String(variant.id),
            })}
            content={
              <VariantCardContent
                variant={variant}
                material={material}
                type={typeOf(material)}
                stock={stats?.stock ?? 0}
                lastSupply={stats?.lastSupply}
                supplyTo={`${pathsRouter.supply}?variant=${String(variant.id)}`}
                suppliesTo={`${pathsRouter.supplies}?variant=${String(variant.id)}`}
                hidden={hidden}
              />
            }
            actions={
              <EntityActions
                isHidden={hidden}
                onDelete={() =>
                  mutations.removeMutation.mutate(variant.id, {
                    onSuccess: () => toastSuccess("Удалено"),
                  })
                }
                onRestore={() => mutations.restoreMutation.mutate(variant.id)}
                deleteBusy={mutations.removeMutation.isPending}
                restoreBusy={mutations.restoreMutation.isPending}
              />
            }
          />
        );
      })}
    </CardGrid>
  );
}
