import { generatePath } from "react-router";

import useMaterialData from "@/features/Material/useMaterial";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import useMaterialTypeData, {
  useMaterialTypesMutations,
} from "@/features/MaterialType/useMaterialType";
import pathsRouter from "@/router/paths.router";
import { toastSuccess } from "@ui/Toast";

import EntityActions from "../../../EntityActions";
import CardGrid from "../CardGrid";
import CatalogCard from "../CatalogCard";
import TypeCardContent from "../CatalogCard/TypeCardContent";

interface Props {
  query: string;
  showHidden: boolean;
}

export default function TypeCards(props: Props) {
  const types = useMaterialTypeData();
  const materials = useMaterialData();
  const mutations = useMaterialTypesMutations();
  const query = props.query.trim().toLowerCase();
  const activeMaterials = materials.getActiveData();
  const childrenOf = (type: MaterialTypeModel) =>
    activeMaterials.filter((material) => material.material_type_id === type.id);
  const rows = props.showHidden ? types.getAllData() : types.getActiveData();
  const visible = rows.filter((type) =>
    [type.name, ...childrenOf(type).map((material) => material.name)]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  return (
    <CardGrid
      loading={types.query.isLoading || materials.query.isLoading}
      count={visible.length}
    >
      {visible.map((type) => (
        <CatalogCard
          key={type.id}
          title={type.name}
          to={generatePath(pathsRouter.materialType, { id: String(type.id) })}
          description={type.description ?? ""}
          content={
            <TypeCardContent
              materials={childrenOf(type)}
              hidden={!!type.deleted_at}
            />
          }
          actions={
            <EntityActions
              isHidden={!!type.deleted_at}
              onDelete={() =>
                mutations.removeMutation.mutate(type.id, {
                  onSuccess: () => toastSuccess("Удалено"),
                })
              }
              onRestore={() => mutations.restoreMutation.mutate(type.id)}
              deleteBusy={mutations.removeMutation.isPending}
              restoreBusy={mutations.restoreMutation.isPending}
            />
          }
        />
      ))}
    </CardGrid>
  );
}
