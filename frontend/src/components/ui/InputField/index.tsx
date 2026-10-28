import { cn } from "cn";
import { useId } from "react";

import {
  Field as BaseField,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@base/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@base/input-group";
import { FormField } from "@ui/Form";

import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

const caretClassName = "caret-ring";

const numericClassName =
  "tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

type InputFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  unit?: string;
  inputClassName?: string;
};

function InputField({
  label,
  id,
  hint,
  error,
  unit,
  inputClassName,
  className,
  type,
  inputMode,
  onWheel,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const unitId = `${fieldId}-unit`;

  const invalid = Boolean(error);
  const numeric = type === "number";
  const messageId = invalid ? errorId : hint ? hintId : null;
  const describedBy =
    [unit ? unitId : null, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <BaseField
      data-disabled={props.disabled ? true : undefined}
      data-invalid={invalid ? true : undefined}
      className={className}
    >
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <InputGroup data-disabled={props.disabled ? "true" : undefined}>
        <InputGroupInput
          id={fieldId}
          type={type}
          inputMode={inputMode ?? (numeric ? "decimal" : undefined)}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          onWheel={(event) => {
            if (numeric) event.currentTarget.blur();
            onWheel?.(event);
          }}
          className={cn(
            caretClassName,
            numeric && numericClassName,
            inputClassName,
          )}
          {...props}
        />
        {unit ? (
          <InputGroupAddon align="inline-end">
            <InputGroupText id={unitId}>{unit}</InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {invalid ? (
        <FieldError id={errorId}>{error}</FieldError>
      ) : hint ? (
        <FieldDescription id={hintId}>{hint}</FieldDescription>
      ) : null}
    </BaseField>
  );
}

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
    <FormField
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
export { FieldGroup, FormInputField, InputField };
export type { FormInputFieldProps, InputFieldProps };
