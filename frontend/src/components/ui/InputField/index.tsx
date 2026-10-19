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

import type { ComponentProps } from "react";

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

export default InputField;
export { InputField, FieldGroup };
export type { InputFieldProps };
