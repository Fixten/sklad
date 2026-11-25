import { ApiError } from "@/api/api-error";
import type { MaterialModel } from "@/features/Material/Material.model";
import { useMaterialMutations } from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { FormInputField } from "@ui/InputField";
import { FormSelectField } from "@ui/SelectField";

import type { MaterialEditDraft } from "./schema";
import { materialEditSchema } from "./schema";

interface Props {
  entity: MaterialModel;
  onDone: () => void;
}

export default function MaterialEditForm(props: Props) {
  const types = useMaterialTypeData();
  const { updateMutation } = useMaterialMutations();
  const available = types.getMap();
  const currentType = available.get(props.entity.material_type_id);
  const form = useZodForm({
    schema: materialEditSchema,
    defaultValues: {
      name: props.entity.name,
      description: props.entity.description ?? "",
      typeId: currentType ? String(currentType.id) : "",
    },
  });
  const hidden = Boolean(props.entity.deleted_at);

  const options = types.getAllData().map((type) => ({
    value: String(type.id),
    label: type.deleted_at ? `${type.name} (скрыт)` : type.name,
  }));

  async function onSubmit(draft: MaterialEditDraft) {
    form.rootError.clear();
    const unchangedType =
      draft.material_type_id === props.entity.material_type_id;
    const dto = hidden
      ? { name: draft.name }
      : {
          name: draft.name,
          description: draft.description,
          ...(unchangedType
            ? {}
            : { material_type_id: draft.material_type_id }),
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
          <FormInputField
            control={form.control}
            name="description"
            label="Описание"
          />
          <FormSelectField
            control={form.control}
            name="typeId"
            label="Тип"
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
