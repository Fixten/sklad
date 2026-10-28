import { FormProvider } from "react-hook-form";

import type { ComponentProps } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

type Props<
  TFieldValues extends FieldValues,
  TContext,
  TTransformedValues,
> = Omit<ComponentProps<"form">, "onSubmit"> & {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit: SubmitHandler<TTransformedValues>;
};

function Form<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  form,
  onSubmit,
  ...props
}: Props<TFieldValues, TContext, TTransformedValues>) {
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <FormProvider {...form}>
      <form
        {...props}
        data-slot="form"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      />
    </FormProvider>
  );
}

export { Form };
export { FormField } from "./FormField";
export { useZodForm } from "./useZodForm";
export type { FormFieldProps } from "./FormField";
export type { UseZodFormProps } from "./useZodForm";
