import { cn } from "cn";
import { useId } from "react";
import type { ComponentProps, ReactNode } from "react";

import {
  Field as BaseField,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@base/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@base/input-group";
import { Spinner } from "@ui/Spinner";

const caretClassName = "caret-ring";

const numericClassName =
  "tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

type InputFieldProps = Omit<ComponentProps<"input">, "id"> & {
  label: string;
  id?: string;
  hint?: string;
  error?: string;
  unit?: string;
  loading?: boolean;
  loadingLabel?: string;
  inputClassName?: string;
};

function InputField({
  label,
  id,
  hint,
  error,
  unit,
  loading = false,
  loadingLabel = "Загрузка",
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
  let messageId: string | null = null;
  if (invalid) {
    messageId = errorId;
  } else if (hint) {
    messageId = hintId;
  }
  const describedBy =
    [unit ? unitId : null, messageId].filter(Boolean).join(" ") || undefined;

  let fieldMessage: ReactNode;
  if (invalid) {
    fieldMessage = <FieldError id={errorId}>{error}</FieldError>;
  } else if (hint) {
    fieldMessage = <FieldDescription id={hintId}>{hint}</FieldDescription>;
  }

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
        {unit || loading ? (
          <InputGroupAddon align="inline-end">
            {unit ? <InputGroupText id={unitId}>{unit}</InputGroupText> : null}
            {loading ? <Spinner aria-label={loadingLabel} /> : null}
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {fieldMessage}
    </BaseField>
  );
}

export default InputField;
export { InputField };
export type { InputFieldProps };
