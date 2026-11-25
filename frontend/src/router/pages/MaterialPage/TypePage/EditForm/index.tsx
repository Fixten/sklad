import { ApiError } from "@/api/api-error";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import { useMaterialTypesMutations } from "@/features/MaterialType/useMaterialType";
import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { FormInputField } from "@ui/InputField";

import type { TypeEditDraft } from "./schema";
import { typeEditSchema } from "./schema";

interface Props {
  entity: MaterialTypeModel;
  onDone: () => void;
}

export default function TypeEditForm(props: Props) {
  const { updateMutation } = useMaterialTypesMutations();
  const form = useZodForm({
    schema: typeEditSchema,
    defaultValues: {
      name: props.entity.name,
      description: props.entity.description ?? "",
    },
  });
  const hidden = Boolean(props.entity.deleted_at);

  async function onSubmit(draft: TypeEditDraft) {
    form.rootError.clear();
    const dto = hidden
      ? { name: draft.name }
      : { name: draft.name, description: draft.description };

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
        <FormInputField
          control={form.control}
          name="description"
          label="Описание"
        />
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
