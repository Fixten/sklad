import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { Button } from "@base/button";
import { Field, FieldError, FieldLabel } from "@base/field";
import { Input } from "@base/input";
import { Form } from "@ui/Form";

import { MaterialDTO, MaterialModel } from "./Material.model";
import SelectMaterialType from "./SelectMaterialType";

interface Props {
  onSubmit: (v: MaterialDTO) => Promise<unknown>;
  isError: boolean;
  value?: MaterialModel;
}

const Material = z.object({
  name: z.string().min(3),
  description: z.string().min(5).or(z.literal("")),
  material_type_id: z.number().min(1),
});

type MaterialForm = z.infer<typeof Material>;

export default function EditMaterial(props: Props) {
  const form = useForm<MaterialForm>({
    resolver: zodResolver(Material),
    defaultValues: {
      name: props.value?.name ?? "",
      description: props.value?.description ?? "",
      material_type_id: props.value?.material_type_id ?? 0,
    },
  });

  const { errors } = form.formState;
  const materialTypeId = useWatch({
    control: form.control,
    name: "material_type_id",
  });
  const isInvalid = props.isError || Object.keys(errors).length > 0;

  async function onSubmit(values: MaterialForm) {
    try {
      await props.onSubmit({
        ...values,
        description: values.description || undefined,
      });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="flex items-end gap-4">
      <Field data-invalid={isInvalid || undefined}>
        <FieldLabel htmlFor="material-name">Название</FieldLabel>
        <Input
          id="material-name"
          aria-invalid={isInvalid || undefined}
          {...form.register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>
      <Field data-invalid={isInvalid || undefined}>
        <FieldLabel htmlFor="material-description">Описание</FieldLabel>
        <Input
          id="material-description"
          aria-invalid={isInvalid || undefined}
          {...form.register("description")}
        />
        <FieldError
          errors={errors.description ? [errors.description] : undefined}
        />
      </Field>
      <SelectMaterialType
        value={String(materialTypeId)}
        onChange={(value) => {
          form.setValue("material_type_id", Number(value), {
            shouldValidate: true,
          });
        }}
        error={props.isError}
        required
        label="Тип материала"
      />
      <Button type="submit">{props.value ? "Изменить" : "Создать"}</Button>
    </Form>
  );
}
