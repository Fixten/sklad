import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import useMaterialData, {
  useMaterialMutations,
} from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { toastSuccess } from "@ui/Toast";
import Typography from "@ui/Typography";

import VariantCards from "../Catalog/CardList/VariantCards";
import EntityActions from "../EntityActions";
import HiddenMessage from "../HiddenMessage";
import VariantEditForm from "../VariantPage/EditForm";

import EditForm from "./EditForm";

const back = { to: pathsRouter.material, label: "Материалы" };

export default function MaterialCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const mutations = useMaterialMutations();
  const [editingId, setEditingId] = useState<number>();
  const [creatingForId, setCreatingForId] = useState<number>();

  if (materials.query.isLoading || types.query.isLoading) {
    return <PageLayout back={back} title="" />;
  }

  const material = materials.getMap().get(Number(id));
  if (!material) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }
  const materialId = material.id;
  const type = types.getMap().get(material.material_type_id);
  const editing = editingId === materialId;
  const creating = creatingForId === materialId;

  if (editing) {
    return (
      <PageLayout back={back} title={material.name}>
        <EditForm entity={material} onDone={() => setEditingId(undefined)} />
      </PageLayout>
    );
  }

  let addVariant: ReactNode;
  if (material.deleted_at) {
    addVariant = null;
  } else if (creating) {
    addVariant = (
      <VariantEditForm
        defaultMaterialId={materialId}
        onDone={() => setCreatingForId(undefined)}
      />
    );
  } else {
    addVariant = (
      <Button
        className="self-start"
        onClick={() => setCreatingForId(materialId)}
      >
        Добавить вариант
      </Button>
    );
  }

  return (
    <PageLayout back={back} title={material.name} className="relative">
      <div
        className="absolute top-0 right-0 flex gap-2"
        data-testid="page-actions"
      >
        <Button
          variant="outline"
          onClick={() => {
            setCreatingForId(undefined);
            setEditingId(materialId);
          }}
        >
          {material.deleted_at ? "Переименовать" : "Редактировать"}
        </Button>
        <EntityActions
          isHidden={!!material.deleted_at}
          onDelete={() => {
            mutations.removeMutation.mutate(materialId, {
              onSuccess: () => {
                toastSuccess("Удалено");
                void navigate(pathsRouter.material);
              },
            });
          }}
          onRestore={() => mutations.restoreMutation.mutate(materialId)}
          deleteBusy={mutations.removeMutation.isPending}
          restoreBusy={mutations.restoreMutation.isPending}
        />
      </div>
      {material.deleted_at ? <HiddenMessage /> : null}
      {material.description ? (
        <Typography>{material.description}</Typography>
      ) : null}
      {type ? <Typography variant="caption">{type.name}</Typography> : null}
      {addVariant}
      <VariantCards query="" showHidden={false} materialId={materialId} />
    </PageLayout>
  );
}
