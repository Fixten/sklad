import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { isFeatureEnabled } from "@/config/features";
import useMaterialData from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import useSupplyData from "@/features/Supply/useSupply";
import { UnitLabels } from "@/features/units";
import useVariantData, {
  useVariantMutations,
} from "@/features/Variant/useVariant";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { toastSuccess } from "@ui/Toast";
import Typography from "@ui/Typography";

import EntityActions from "../EntityActions";
import HiddenMessage from "../HiddenMessage";

import EditForm from "./EditForm";
import SupplyRows from "./SupplyRows";

const back = { to: pathsRouter.material, label: "Материалы" };

interface VariantSuppliesProps {
  variantId: number;
}

function VariantSupplies(props: VariantSuppliesProps) {
  const supplies = useSupplyData({ material_variant_id: props.variantId });
  return <SupplyRows supplies={supplies.getAllData()} />;
}

export default function VariantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const variants = useVariantData();
  const materials = useMaterialData();
  const types = useMaterialTypeData();
  const mutations = useVariantMutations();
  const [editingId, setEditingId] = useState<number>();
  const variant = variants.getMap().get(Number(id));

  if (
    variants.query.isLoading ||
    materials.query.isLoading ||
    types.query.isLoading
  ) {
    return <PageLayout back={back} title="" />;
  }

  if (!variant) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }

  const variantId = variant.id;
  const editing = editingId === variantId;

  if (editing) {
    return (
      <PageLayout back={back} title={variant.name}>
        <EditForm entity={variant} onDone={() => setEditingId(undefined)} />
      </PageLayout>
    );
  }

  const material = materials.getMap().get(variant.material_id);
  const type = material
    ? types.getMap().get(material.material_type_id)
    : undefined;
  const context = [material?.name, type?.name].filter(Boolean).join(" · ");

  return (
    <PageLayout back={back} title={variant.name} className="relative">
      <div
        className="absolute top-0 right-0 flex gap-2"
        data-testid="page-actions"
      >
        <Button variant="outline" onClick={() => setEditingId(variantId)}>
          {variant.deleted_at ? "Переименовать" : "Редактировать"}
        </Button>
        <EntityActions
          isHidden={!!variant.deleted_at}
          onDelete={() => {
            mutations.removeMutation.mutate(variantId, {
              onSuccess: () => {
                toastSuccess("Удалено");
                void navigate(pathsRouter.material);
              },
            });
          }}
          onRestore={() => mutations.restoreMutation.mutate(variantId)}
          deleteBusy={mutations.removeMutation.isPending}
          restoreBusy={mutations.restoreMutation.isPending}
        />
      </div>
      {variant.deleted_at ? <HiddenMessage /> : null}
      <Typography variant="caption">
        Единица: {UnitLabels[variant.unit]}
      </Typography>
      {context ? <Typography variant="caption">{context}</Typography> : null}
      {isFeatureEnabled("supply") && !variant.deleted_at ? (
        <Button
          className="self-start"
          onClick={() => {
            void navigate(`${pathsRouter.supply}?variant=${String(variantId)}`);
          }}
        >
          Сделать поставку
        </Button>
      ) : null}
      <VariantSupplies variantId={variantId} />
    </PageLayout>
  );
}
