import { generatePath, useNavigate } from "react-router";

import { ApiError } from "@/api/api-error";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import { useMaterialTypesMutations } from "@/features/MaterialType/useMaterialType";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { FormInputField } from "@ui/InputField";
import { FieldGroup } from "@ui/InputFieldGroup";

import type { TypeEditDraft } from "./schema";
import { typeEditSchema } from "./schema";

interface Props {
  entity?: MaterialTypeModel;
  onDone: () => void;
}

export default function TypeEditForm(props: Props) {
  const navigate = useNavigate();
  const { addMutation, updateMutation } = useMaterialTypesMutations();
  const entity = props.entity;
  const form = useZodForm({
    schema: typeEditSchema,
    defaultValues: {
      name: entity?.name ?? "",
      description: entity?.description ?? "",
    },
  });
  const hidden = Boolean(entity?.deleted_at);

  async function onSubmit(draft: TypeEditDraft) {
    form.rootError.clear();

    try {
      if (entity) {
        const dto = hidden
          ? { name: draft.name }
          : { name: draft.name, description: draft.description };
        await updateMutation.mutateAsync({ dto, id: entity.id });
        props.onDone();
      } else {
        const created = await addMutation.mutateAsync({
          name: draft.name,
          description: draft.description,
        });
        void navigate(
          generatePath(pathsRouter.materialType, { id: String(created.id) }),
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
          <FormInputField
            control={form.control}
            name="description"
            label="Описание"
          />
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
