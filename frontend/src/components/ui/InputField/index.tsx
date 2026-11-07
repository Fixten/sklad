import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { InputField } from "./InputField";
import type { InputFieldProps } from "./InputField";

type FormInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext,
  TTransformedValues,
> = Omit<
  InputFieldProps,
  | "name"
  | "value"
  | "defaultValue"
  | "defaultChecked"
  | "checked"
  | "onChange"
  | "onBlur"
  | "error"
  | "ref"
> & {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  name: TName;
  onChange?: InputFieldProps["onChange"];
  onBlur?: InputFieldProps["onBlur"];
};

function FormInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  onChange,
  onBlur,
  disabled,
  ...props
}: FormInputFieldProps<TFieldValues, TName, TContext, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <InputField
          {...props}
          name={field.name}
          ref={field.ref}
          value={field.value ?? ""}
          disabled={disabled ?? field.disabled}
          error={fieldState.error?.message}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
        />
      )}
    />
  );
}

export default InputField;
export { FormInputField, InputField };
export type { FormInputFieldProps, InputFieldProps };
