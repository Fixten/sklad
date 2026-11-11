import { useFormContext, useWatch } from "react-hook-form";

import useMaterial from "@/features/Material/useMaterial";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function MaterialPicker() {
  const { materials } = useMaterial();
  const { types } = useMaterialType();
  const { control, setValue } = useFormContext<SupplyFormValues>();
  const type = useWatch({ control, name: "type" });
  const material = useWatch({ control, name: "material" });

  const chosenTypeId = types.find((item) => item.name === type)?.id;
  const options: OptionPickerOption[] = materials
    .filter((item) => item.material_type_id === chosenTypeId)
    .map((item) => ({
      value: item.name,
      label: item.name,
    }));

  function onSelect(value: string) {
    if (value === material) return;

    setValue("variant", "", writeOptions);
  }

  return (
    <FormOptionPicker
      control={control}
      name="material"
      label="Материал"
      options={options}
      canCreate
      onSelect={onSelect}
    />
  );
}
