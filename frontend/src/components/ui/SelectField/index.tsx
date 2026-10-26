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
}

export default function SelectField({
  label,
  options,
  value,
  onValueChange,
  error,
  className,
}: Props) {
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const errorId = `${fieldId}-error`;
  const invalid = Boolean(error);

  return (
    <Field data-invalid={invalid ? true : undefined} className={className}>
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <Select
        items={options}
        value={value}
        onValueChange={(next) => {
          onValueChange(String(next));
        }}
      >
        <SelectTrigger
          id={fieldId}
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

export type { Option as SelectFieldOption };
