import { generatePath } from "react-router";

import type { MaterialModel } from "@/features/Material/Material.model";
import useMaterialData, {
  useMaterialMutations,
} from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import useVariantData from "@/features/Variant/useVariant";
import pathsRouter from "@/router/paths.router";
import { toastSuccess } from "@ui/Toast";

import EntityActions from "../../EntityActions";
import CardGrid from "../CardGrid";
import CatalogCard from "../CatalogCard";
import MaterialCardContent from "../CatalogCard/MaterialCardContent";

interface Props {
  query: string;
  showHidden: boolean;
  typeId?: number;
}

export default function MaterialCards(props: Props) {
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const variants = useVariantData();
  const mutations = useMaterialMutations();
  const query = props.query.trim().toLowerCase();
  const typeMap = types.getMap();
  const activeVariants = variants.getActiveData();
  const typeOf = (material: MaterialModel) =>
    typeMap.get(material.material_type_id);
  const childrenOf = (material: MaterialModel) =>
    activeVariants.filter((variant) => variant.material_id === material.id);
  const searchText = (material: MaterialModel) =>
    [
      material.name,
      typeOf(material)?.name,
      ...childrenOf(material).map((variant) => variant.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  const rows = props.showHidden
    ? materials.getAllData()
    : materials.getActiveData();
  const visible = rows.filter(
    (material) =>
      (props.typeId === undefined ||
        material.material_type_id === props.typeId) &&
      searchText(material).includes(query),
  );

  return (
    <CardGrid
      loading={
        materials.query.isLoading ||
        types.query.isLoading ||
        variants.query.isLoading
      }
      count={visible.length}
    >
      {visible.map((material) => (
        <CatalogCard
          key={material.id}
          title={material.name}
          to={generatePath(pathsRouter.materialItem, {
            id: String(material.id),
          })}
          description={material.description ?? ""}
          content={
            <MaterialCardContent
              type={typeOf(material)}
              variants={childrenOf(material)}
              hidden={!!material.deleted_at}
            />
          }
          actions={
            <EntityActions
              isHidden={!!material.deleted_at}
              onDelete={() =>
                mutations.removeMutation.mutate(material.id, {
                  onSuccess: () => toastSuccess("Удалено"),
                })
              }
              onRestore={() => mutations.restoreMutation.mutate(material.id)}
              deleteBusy={mutations.removeMutation.isPending}
              restoreBusy={mutations.restoreMutation.isPending}
            />
          }
        />
      ))}
    </CardGrid>
  );
}
