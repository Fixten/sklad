import { useState } from "react";
import { useParams } from "react-router";

import useMaterialData from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

import VariantCards from "../Catalog/CardList/VariantCards";

import EditForm from "./EditForm";

const back = { to: pathsRouter.material, label: "Материалы" };

export default function MaterialCardPage() {
  const { id } = useParams();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const [editing, setEditing] = useState(false);

  if (materials.query.isLoading || types.query.isLoading) {
    return <PageLayout back={back} title="" />;
  }

  const material = materials.getMap().get(Number(id));
  if (!material) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }
  const type = types.getMap().get(material.material_type_id);

  if (editing) {
    return (
      <PageLayout back={back} title={material.name}>
        <EditForm entity={material} onDone={() => setEditing(false)} />
      </PageLayout>
    );
  }

  return (
    <PageLayout back={back} title={material.name} className="relative">
      <Button
        className="absolute top-0 right-0"
        onClick={() => setEditing(true)}
      >
        {material.deleted_at ? "Переименовать" : "Редактировать"}
      </Button>
      {material.description ? (
        <Typography>{material.description}</Typography>
      ) : null}
      {type ? <Typography variant="caption">{type.name}</Typography> : null}
      <Button>Добавить вариант</Button>
      <VariantCards query="" showHidden={false} materialId={material.id} />
    </PageLayout>
  );
}
