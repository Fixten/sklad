import { useQuery } from "@tanstack/react-query";
import { generatePath, useNavigate } from "react-router";

import { ApiError } from "@/api/api-error";
import useMaterialData from "@/features/Material/useMaterial";
import { UnitOptions } from "@/features/units";
import { useVariantMutations } from "@/features/Variant/useVariant";
import VariantApi from "@/features/Variant/Variant.api";
import type { VariantModel } from "@/features/Variant/Variant.model";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { FormInputField } from "@ui/InputField";
import { FieldGroup } from "@ui/InputFieldGroup";
import { FormSelectField } from "@ui/SelectField";
import Typography from "@ui/Typography";

import type { VariantEditDraft } from "./schema";
import { variantEditSchema } from "./schema";

const api = new VariantApi();

interface Props {
  entity?: VariantModel;
  defaultMaterialId?: number;
  onDone: () => void;
}

export default function VariantEditForm(props: Props) {
  const navigate = useNavigate();
  const materials = useMaterialData();
  const { addMutation, updateMutation } = useVariantMutations();
  const entity = props.entity;
  const available = materials.getMap();
  const initialMaterialId = entity?.material_id ?? props.defaultMaterialId;
  const currentMaterial =
    initialMaterialId === undefined
      ? undefined
      : available.get(initialMaterialId);
  const form = useZodForm({
    schema: variantEditSchema,
    defaultValues: {
      name: entity?.name ?? "",
      unit: entity?.unit ?? "meters",
      materialId: currentMaterial ? String(currentMaterial.id) : "",
    },
  });
  const hidden = Boolean(entity?.deleted_at);
  const entityId = entity?.id;
  const detail = useQuery({
    queryKey: ["material-variant", entityId],
    queryFn: () => {
      if (entityId === undefined) throw new Error("Missing entity");
      return api.get(entityId);
    },
    enabled: entityId !== undefined,
    retry: false,
  });
  const unitUnverified =
    Boolean(entity) && (detail.isPending || detail.isError);
  const unitLocked =
    Boolean(entity) && (unitUnverified || Boolean(detail.data?.unit_locked));
  let unitHint: string | undefined;
  if (unitUnverified) {
    unitHint = "Не удалось проверить единицу";
  } else if (unitLocked) {
    unitHint = "Единицу нельзя изменить";
  }

  const selectableMaterials = entity
    ? materials.getAllData()
    : materials.getActiveData();
  const options = selectableMaterials.map((material) => ({
    value: String(material.id),
    label: material.deleted_at ? `${material.name} (скрыт)` : material.name,
  }));

  async function onSubmit(draft: VariantEditDraft) {
    form.rootError.clear();

    try {
      if (entity) {
        const unchangedMaterial = draft.material_id === entity.material_id;
        const dto = hidden
          ? { name: draft.name }
          : {
              name: draft.name,
              ...(unitLocked ? {} : { unit: draft.unit }),
              ...(unchangedMaterial ? {} : { material_id: draft.material_id }),
            };
        await updateMutation.mutateAsync({ dto, id: entity.id });
        props.onDone();
      } else {
        const created = await addMutation.mutateAsync({
          name: draft.name,
          unit: draft.unit,
          material_id: draft.material_id,
        });
        void navigate(
          generatePath(pathsRouter.materialVariant, { id: String(created.id) }),
        );
      }
    } catch (error) {
      form.rootError.set(
        error instanceof ApiError ? error.message : "Не удалось сохранить",
      );
    }
  }

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex max-w-md flex-col gap-6"
    >
      <FieldGroup className="gap-6">
        <FormInputField control={form.control} name="name" label="Название" />
        {hidden ? null : (
          <>
            <FormSelectField
              control={form.control}
              name="unit"
              label="Единица"
              options={UnitOptions}
              disabled={unitLocked}
            />
            {unitHint ? (
              <Typography variant="caption">{unitHint}</Typography>
            ) : null}
            <FormSelectField
              control={form.control}
              name="materialId"
              label="Материал"
              options={options}
            />
          </>
        )}
      </FieldGroup>
      <InlineError message={form.rootError.message} />
      <div className="flex gap-4">
        <Button
          type="submit"
          pending={addMutation.isPending || updateMutation.isPending}
          pendingLabel="Сохраняем"
        >
          Сохранить
        </Button>
        <Button onClick={props.onDone} variant="outline">
          Отмена
        </Button>
      </div>
    </Form>
  );
}
