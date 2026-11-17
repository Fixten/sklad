import { useFormContext, useWatch } from "react-hook-form";

import useMaterialType from "@/features/MaterialType/useMaterialType";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function TypePicker() {
  const { getAllData } = useMaterialType();
  const { control, setValue } = useFormContext<SupplyFormValues>();
  const typeString = useWatch({ control, name: "typeId" });
  const type = Number(typeString);
  const types = getAllData();

  const options: OptionPickerOption[] = types.map((item) => ({
    value: String(item.id),
    label: item.name,
  }));

  function onSelect(id: string) {
    const numberId = Number(id);
    if (numberId !== type) {
      setValue("materialId", "", writeOptions);
      setValue("variantId", "", writeOptions);
      setValue("unit", "", writeOptions);
    }
  }

  return (
    <FormOptionPicker
      control={control}
      name="typeId"
      label="Тип"
      options={options}
      onSelect={onSelect}
    />
  );
}
