import { useFormContext, useWatch } from "react-hook-form";

import useMaterial from "@/features/Material/useMaterial";
import useVariant from "@/features/Variant/useVariant";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function VariantPicker() {
  const { materials } = useMaterial();
  const { variants } = useVariant();
  const { control, setValue } = useFormContext<SupplyFormValues>();
  const material = useWatch({ control, name: "material" });

  const chosenMaterialId = materials.find((item) => item.name === material)?.id;
  const options: OptionPickerOption[] = variants
    .filter((item) => item.material_id === chosenMaterialId)
    .map((item) => ({
      value: item.name,
      label: item.name,
    }));

  function onSelect(value: string) {
    const unit = variants.find(
      (item) => item.material_id === chosenMaterialId && item.name === value,
    )?.unit;

    if (unit) setValue("unit", unit, writeOptions);
  }

  return (
    <FormOptionPicker
      control={control}
      name="variant"
      label="Вариант"
      options={options}
      onSelect={onSelect}
    />
  );
}
