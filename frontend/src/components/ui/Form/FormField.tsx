import { useController } from "react-hook-form";

import type { ReactNode } from "react";
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  FormState,
} from "react-hook-form";

interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext,
  TTransformedValues,
> {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  name: TName;
  disabled?: boolean;
  shouldUnregister?: boolean;
  render: (state: {
    field: ControllerRenderProps<TFieldValues, TName>;
    fieldState: ControllerFieldState;
    formState: FormState<TFieldValues>;
  }) => ReactNode;
}

function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  disabled,
  shouldUnregister,
  render,
}: FormFieldProps<TFieldValues, TName, TContext, TTransformedValues>) {
  const { field, fieldState, formState } = useController({
    control,
    name,
    disabled,
    shouldUnregister,
  });

  return <>{render({ field, fieldState, formState })}</>;
}

export { FormField };
export type { FormFieldProps };
