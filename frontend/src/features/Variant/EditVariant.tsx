import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import zod from "zod";

import { Button } from "@base/button";
import { Field, FieldError, FieldLabel } from "@base/field";
import { Input } from "@base/input";
import { Form } from "@ui/Form";

import { VariantModel } from "./Variant.model";

interface Props {
  onClose: () => void;
  onSubmit: (v: VariantModel) => Promise<unknown>;
}

const validator = zod.object({
  name: zod.string().min(2),
});

type VariantForm = zod.infer<typeof validator>;

export default function EditVariant(props: Props) {
  const form = useForm<VariantForm>({
    resolver: zodResolver(validator),
    defaultValues: { name: "" },
  });

  const { errors } = form.formState;

  function onSubmit() {
    // await props.onSubmit({ variant: name });
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="flex items-end gap-4">
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="variant-name">Название</FieldLabel>
        <Input
          id="variant-name"
          aria-invalid={errors.name ? true : undefined}
          {...form.register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>
      <Button type="submit">Сохранить</Button>
      <Button onClick={props.onClose}>Отменить</Button>
    </Form>
  );
}
