import { useState } from "react";
import { useParams } from "react-router";

import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

import MaterialCards from "../Catalog/CardList/MaterialCards";

import EditForm from "./EditForm";

const back = { to: pathsRouter.material, label: "Материалы" };

export default function TypePage() {
  const { id } = useParams();
  const types = useMaterialTypeData();
  const [editing, setEditing] = useState(false);

  if (types.query.isLoading) {
    return <PageLayout back={back} title="" />;
  }

  const type = types.getMap().get(Number(id));
  if (!type) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }

  if (editing) {
    return (
      <PageLayout back={back} title={type.name}>
        <EditForm entity={type} onDone={() => setEditing(false)} />
      </PageLayout>
    );
  }

  return (
    <PageLayout back={back} title={type.name} className="relative">
      <Button
        className="absolute top-0 right-0"
        onClick={() => setEditing(true)}
      >
        {type.deleted_at ? "Переименовать" : "Редактировать"}
      </Button>
      {type.description ? <Typography>{type.description}</Typography> : null}
      <MaterialCards query="" showHidden={false} typeId={type.id} />
    </PageLayout>
  );
}
