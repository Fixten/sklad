import useMaterialData from "@/features/Material/useMaterial";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";

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
          description={type.description ?? ""}
          content={<TypeCardContent materials={childrenOf(type)} />}
        />
      ))}
    </CardGrid>
  );
}
