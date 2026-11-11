import { useFormContext, useWatch } from "react-hook-form";

import useMaterialType from "@/features/MaterialType/useMaterialType";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function TypePicker() {
  const { types } = useMaterialType();
  const { control, setValue } = useFormContext<SupplyFormValues>();
  const type = useWatch({ control, name: "type" });

  const options: OptionPickerOption[] = types.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  function onSelect(value: string) {
    if (value === type) return;

    setValue("material", "", writeOptions);
    setValue("variant", "", writeOptions);
  }

  return (
    <FormOptionPicker
      control={control}
      name="type"
      label="Тип"
      options={options}
      canCreate
      onSelect={onSelect}
    />
  );
}
