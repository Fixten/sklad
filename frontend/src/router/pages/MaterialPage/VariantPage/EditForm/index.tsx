import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/api/api-error";
import useMaterialData from "@/features/Material/useMaterial";
import { UnitOptions } from "@/features/units";
import { useVariantMutations } from "@/features/Variant/useVariant";
import VariantApi from "@/features/Variant/Variant.api";
import type { VariantModel } from "@/features/Variant/Variant.model";
import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { FormInputField } from "@ui/InputField";
import { FormSelectField } from "@ui/SelectField";
import Typography from "@ui/Typography";

import type { VariantEditDraft } from "./schema";
import { variantEditSchema } from "./schema";

const api = new VariantApi();

interface Props {
  entity: VariantModel;
  onDone: () => void;
}

export default function VariantEditForm(props: Props) {
  const materials = useMaterialData();
  const { updateMutation } = useVariantMutations();
  const available = materials.getMap();
  const currentMaterial = available.get(props.entity.material_id);
  const form = useZodForm({
    schema: variantEditSchema,
    defaultValues: {
      name: props.entity.name,
      unit: props.entity.unit,
      materialId: currentMaterial ? String(currentMaterial.id) : "",
    },
  });
  const hidden = Boolean(props.entity.deleted_at);
  const detail = useQuery({
    queryKey: ["material-variant", props.entity.id],
    queryFn: () => api.get(props.entity.id),
    retry: false,
  });
  const unitUnverified = detail.isPending || detail.isError;
  const unitLocked = unitUnverified || detail.data.unit_locked;
  const unitHint = unitUnverified
    ? "Не удалось проверить единицу"
    : unitLocked
      ? "Единицу нельзя изменить"
      : undefined;

  const options = materials.getAllData().map((material) => ({
    value: String(material.id),
    label: material.deleted_at ? `${material.name} (скрыт)` : material.name,
  }));

  async function onSubmit(draft: VariantEditDraft) {
    form.rootError.clear();
    const unchangedMaterial = draft.material_id === props.entity.material_id;
    const dto = hidden
      ? { name: draft.name }
      : {
          name: draft.name,
          ...(unitLocked ? {} : { unit: draft.unit }),
          ...(unchangedMaterial ? {} : { material_id: draft.material_id }),
        };

    try {
      await updateMutation.mutateAsync({ dto, id: props.entity.id });
      props.onDone();
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
      <InlineError message={form.rootError.message} />
      <div className="flex gap-4">
        <Button
          type="submit"
          pending={updateMutation.isPending}
          pendingLabel="Сохраняем"
        >
          Сохранить
        </Button>
        <Button onClick={props.onDone}>Отмена</Button>
      </div>
    </Form>
  );
}
