import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import useMaterialTypeData, {
  useMaterialTypesMutations,
} from "@/features/MaterialType/useMaterialType";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { toastSuccess } from "@ui/Toast";
import Typography from "@ui/Typography";

import MaterialCards from "../Catalog/CardList/MaterialCards";
import EntityActions from "../EntityActions";
import HiddenMessage from "../HiddenMessage";
import MaterialEditForm from "../MaterialCardPage/EditForm";

import EditForm from "./EditForm";

const back = { to: pathsRouter.material, label: "Материалы" };

export default function TypePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const types = useMaterialTypeData();
  const mutations = useMaterialTypesMutations();
  const [editingId, setEditingId] = useState<number>();
  const [creatingForId, setCreatingForId] = useState<number>();

  if (types.query.isLoading) {
    return <PageLayout back={back} title="" />;
  }

  const type = types.getMap().get(Number(id));
  if (!type) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }

  const typeId = type.id;
  const editing = editingId === typeId;
  const creating = creatingForId === typeId;

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
      <div
        className="absolute top-0 right-0 flex gap-2"
        data-testid="page-actions"
      >
        <Button
          onClick={() => {
            setCreatingForId(undefined);
            setEditingId(typeId);
          }}
        >
          {type.deleted_at ? "Переименовать" : "Редактировать"}
        </Button>
        <EntityActions
          isHidden={!!type.deleted_at}
          onDelete={() => {
            mutations.removeMutation.mutate(typeId, {
              onSuccess: () => {
                toastSuccess("Удалено");
                void navigate(pathsRouter.material);
              },
            });
          }}
          onRestore={() => mutations.restoreMutation.mutate(typeId)}
          deleteBusy={mutations.removeMutation.isPending}
          restoreBusy={mutations.restoreMutation.isPending}
        />
      </div>
      {type.deleted_at ? <HiddenMessage /> : null}
      {type.description ? <Typography>{type.description}</Typography> : null}
      {addMaterial}
      <MaterialCards query="" showHidden={false} typeId={typeId} />
    </PageLayout>
  );
}
