import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePlus, Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { Button } from "ui/button";
import { Card } from "ui/card";
import { Field, FieldError, FieldLabel } from "ui/field";
import { Form } from "ui/form";
import { Input } from "ui/input";
import { Spinner } from "ui/spinner";

import useMaterialType from "../../../features/MaterialType/useMaterialType";

const NewMaterialType = z.object({
  name: z.string().min(1),
});

type NewMaterialTypeForm = z.infer<typeof NewMaterialType>;

export default function MaterialTypePage() {
  const { query, addMutation } = useMaterialType();
  const form = useForm<NewMaterialTypeForm>({
    resolver: zodResolver(NewMaterialType),
    defaultValues: { name: "" },
  });

  const { errors } = form.formState;
  const newName = useWatch({ control: form.control, name: "name" });
  const isInvalid = addMutation.isError || Boolean(errors.name);

  async function onSubmit(values: NewMaterialTypeForm) {
    try {
      await addMutation.mutateAsync(values.name);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className="flex flex-col gap-8">
      <Form form={form} onSubmit={onSubmit} className="flex items-end gap-8">
        <Field
          data-invalid={isInvalid || undefined}
          className="w-full max-w-sm"
        >
          <FieldLabel htmlFor="new-material-type">Добавить новый</FieldLabel>
          <Input
            id="new-material-type"
            aria-invalid={isInvalid || undefined}
            {...form.register("name", {
              onChange: () => {
                if (addMutation.isError || addMutation.isSuccess) {
                  addMutation.reset();
                }
              },
            })}
          />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>
        {newName && (
          <Button variant="outline" size="icon" type="submit">
            <BadgePlus />
          </Button>
        )}
        {addMutation.isSuccess && <Check />}
      </Form>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Card>
          <ul>
            {/* {query.data?.map((v, i, arr) => {
              const current = arr[arr.length - 1 - i];
              return (
                <Fragment key={current.id}>
                  <li className="flex items-center justify-between p-2">
                    {current.name}{" "}
                    <Button
                      onClick={() => {
                        removeMutation.mutate(current.id);
                      }}
                      variant="outline"
                      size="icon"
                    >
                      <Delete />
                    </Button>
                  </li>
                  {i < arr.length - 1 && <Divider />}
                </Fragment>
              );
            })} */}
          </ul>
        </Card>
      )}
    </section>
  );
}
