import { useWatch } from "react-hook-form";

import { UnitOptions } from "@/features/units";
import { Button } from "@ui/Button";
import { Form, FormField, useZodForm } from "@ui/Form";
import { FormInputField } from "@ui/InputField";
import Panel from "@ui/Panel";
import SelectField, { FormSelectField } from "@ui/SelectField";

import { supplyWizard } from "../../supplyWizard";

import {
  createMaterialFormSchema,
  materialFormDefaults,
  NewTypeValue,
} from "./materialForm";
import { useMaterialStep } from "./useMaterialStep";

import type { MaterialDraft } from "./materialDraft";

export default function MaterialStep() {
  const { shared } = supplyWizard.useWizard();
  const { types, pending, create } = useMaterialStep();
  const schema = createMaterialFormSchema(types);
  const form = useZodForm({
    schema,
    defaultValues: materialFormDefaults(shared.query),
  });
  const typeId = useWatch({ control: form.control, name: "typeId" });
  const { isSubmitting } = form.formState;
  const busy = pending || isSubmitting;

  const fallbackTypeId = types[0] ? String(types[0].id) : NewTypeValue;
  const resolvedTypeId = typeId ?? fallbackTypeId;
  const isNewType = resolvedTypeId === NewTypeValue;
  const typeOptions = [
    ...types.map((type) => ({
      value: String(type.id),
      label: type.name,
    })),
    { value: NewTypeValue, label: "+ Новый тип" },
  ];

  const submit = async (draft: MaterialDraft) => {
    if (busy) return;

    await create(draft);
  };

  return (
    <Panel label="Новый материал">
      <Form form={form} onSubmit={submit} aria-busy={busy || undefined}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="typeId"
            render={({ field, fieldState }) => (
              <SelectField
                label="Тип"
                options={typeOptions}
                value={field.value ?? fallbackTypeId}
                name={field.name}
                ref={field.ref}
                error={fieldState.error?.message}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {isNewType ? (
            <FormInputField
              control={form.control}
              name="typeName"
              label="Название типа"
              autoFocus
              onChange={() => {
                if (form.getValues("typeId") !== NewTypeValue) {
                  form.setValue("typeId", NewTypeValue, { shouldDirty: true });
                }
              }}
            />
          ) : null}
          <FormInputField
            control={form.control}
            name="materialName"
            label="Материал"
          />
          <FormInputField
            control={form.control}
            name="variantName"
            label="Вариант"
          />
          <FormSelectField
            control={form.control}
            name="unit"
            label="Единица"
            options={UnitOptions}
          />
          <Button
            type="submit"
            pending={busy}
            pendingLabel="Создаём…"
            className="col-start-2 justify-self-end"
          >
            Создать и продолжить
          </Button>
        </div>
      </Form>
    </Panel>
  );
}
