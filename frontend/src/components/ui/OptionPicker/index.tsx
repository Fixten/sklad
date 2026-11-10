import { Controller } from "react-hook-form";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import OptionPicker from "./OptionPicker";
import type { OptionPickerProps } from "./OptionPicker";

type FormOptionPickerProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext,
  TTransformedValues,
> = Omit<OptionPickerProps, "name" | "value" | "error"> & {
  control: Control<TFieldValues, TContext, TTransformedValues>;
  name: TName;
};

function FormOptionPicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = unknown,
  TTransformedValues = TFieldValues,
>({
  control,
  name,
  ...props
}: FormOptionPickerProps<TFieldValues, TName, TContext, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <OptionPicker
          {...props}
          name={field.name}
          value={field.value}
          error={fieldState.error?.message}
          onSelect={(option: string) => {
            field.onChange(option);
            props.onSelect(option);
          }}
          options={props.options}
        />
      )}
    />
  );
}

export default OptionPicker;
export { FormOptionPicker };
export type { FormOptionPickerProps, OptionPickerProps };
