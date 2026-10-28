import { useId } from "react";

import { Field, FieldError, FieldLabel } from "@base/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base/select";
import { FormField } from "@ui/Form";

import type { ComponentProps, Ref } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
  form?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: ComponentProps<"button">["onBlur"];
  ref?: Ref<HTMLButtonElement>;
}

function SelectField({
  label,
  options,
  value,
  onValueChange,
  error,
  className,
  id,
  name,
  form,
  disabled,
  required,
  onBlur,
  ref,
}: Props) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(error);

  return (
    <Field data-invalid={invalid ? true : undefined} className={className}>
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <Select
        items={options}
        value={value}
        name={name}
        form={form}
        disabled={disabled}
        required={required}
        onValueChange={(next) => {
          onValueChange(String(next));
        }}
      >
        <SelectTrigger
          ref={ref}
          id={fieldId}
          disabled={disabled}
          onBlur={onBlur}
          aria-labelledby={labelId}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid ? errorId : undefined}
          className="w-full"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {invalid ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}

type FormSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext,
  TTransformedValues,
> = Omit<
  Props,
  "name" | "value" | "onValueChange" | "error" | "onBlur" | "ref"
> & {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  name: TName;
  onValueChange?: (value: string) => void;
  onBlur?: Props["onBlur"];
};

function FormSelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  onValueChange,
  onBlur,
  disabled,
  ...props
}: FormSelectFieldProps<TFieldValues, TName, TContext, TTransformedValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <SelectField
          {...props}
          name={field.name}
          ref={field.ref}
          value={field.value == null ? "" : String(field.value)}
          disabled={disabled ?? field.disabled}
          error={fieldState.error?.message}
          onValueChange={(value) => {
            field.onChange(value);
            onValueChange?.(value);
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

export default SelectField;
export { FormSelectField };
export type {
  FormSelectFieldProps,
  Option as SelectFieldOption,
  Props as SelectFieldProps,
};
