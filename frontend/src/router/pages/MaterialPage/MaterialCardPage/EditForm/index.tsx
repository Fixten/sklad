import { generatePath, useNavigate } from "react-router";

import { ApiError } from "@/api/api-error";
import type { MaterialModel } from "@/features/Material/Material.model";
import { useMaterialMutations } from "@/features/Material/useMaterial";
import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { FormInputField } from "@ui/InputField";
import { FieldGroup } from "@ui/InputFieldGroup";
import { FormSelectField } from "@ui/SelectField";

import type { MaterialEditDraft } from "./schema";
import { materialEditSchema } from "./schema";

interface Props {
  entity?: MaterialModel;
  defaultTypeId?: number;
  onDone: () => void;
}

export default function MaterialEditForm(props: Props) {
  const navigate = useNavigate();
  const types = useMaterialTypeData();
  const { addMutation, updateMutation } = useMaterialMutations();
  const entity = props.entity;
  const available = types.getMap();
  const initialTypeId = entity?.material_type_id ?? props.defaultTypeId;
  const currentType =
    initialTypeId === undefined ? undefined : available.get(initialTypeId);
  const form = useZodForm({
    schema: materialEditSchema,
    defaultValues: {
      name: entity?.name ?? "",
      description: entity?.description ?? "",
      typeId: currentType ? String(currentType.id) : "",
    },
  });
  const hidden = Boolean(entity?.deleted_at);
  const selectableTypes = entity ? types.getAllData() : types.getActiveData();

  const options = selectableTypes.map((type) => ({
    value: String(type.id),
    label: type.deleted_at ? `${type.name} (скрыт)` : type.name,
  }));

  async function onSubmit(draft: MaterialEditDraft) {
    form.rootError.clear();

    try {
      if (entity) {
        const unchangedType =
          draft.material_type_id === entity.material_type_id;
        const dto = hidden
          ? { name: draft.name }
          : {
              name: draft.name,
              description: draft.description,
              ...(unchangedType
                ? {}
                : { material_type_id: draft.material_type_id }),
            };
        await updateMutation.mutateAsync({ dto, id: entity.id });
        props.onDone();
      } else {
        const created = await addMutation.mutateAsync({
          name: draft.name,
          description: draft.description,
          material_type_id: draft.material_type_id,
        });
        void navigate(
          generatePath(pathsRouter.materialItem, { id: String(created.id) }),
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
        <Button onClick={props.onDone}>Отмена</Button>
      </div>
    </Form>
  );
}
