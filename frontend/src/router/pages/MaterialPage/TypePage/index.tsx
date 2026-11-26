import { useState } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router";

import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

import MaterialCards from "../Catalog/CardList/MaterialCards";
import MaterialEditForm from "../MaterialCardPage/EditForm";

import EditForm from "./EditForm";

const back = { to: pathsRouter.material, label: "Материалы" };

export default function TypePage() {
  const { id } = useParams();
  const types = useMaterialTypeData();
  const [editingId, setEditingId] = useState<number>();
  const [creatingForId, setCreatingForId] = useState<number>();

  if (types.query.isLoading) {
    return <PageLayout back={back} title="" />;
  }

  const type = types.getMap().get(Number(id));
  if (!type) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }

  const editing = editingId === type.id;
  const creating = creatingForId === type.id;

  if (editing) {
    return (
      <PageLayout back={back} title={type.name}>
        <EditForm entity={type} onDone={() => setEditingId(undefined)} />
      </PageLayout>
    );
  }

  let addMaterial: ReactNode;
  if (type.deleted_at) {
    addMaterial = null;
  } else if (creating) {
    addMaterial = (
      <MaterialEditForm
        defaultTypeId={type.id}
        onDone={() => setCreatingForId(undefined)}
      />
    );
  } else {
    addMaterial = (
      <Button onClick={() => setCreatingForId(type.id)}>
        Добавить материал
      </Button>
    );
  }

  return (
    <PageLayout back={back} title={type.name} className="relative">
      <Button
        className="absolute top-0 right-0"
        onClick={() => {
          setCreatingForId(undefined);
          setEditingId(type.id);
        }}
      >
        {type.deleted_at ? "Переименовать" : "Редактировать"}
      </Button>
      {type.description ? <Typography>{type.description}</Typography> : null}
      {addMaterial}
      <MaterialCards query="" showHidden={false} typeId={type.id} />
    </PageLayout>
  );
}
