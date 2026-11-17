import { useFormContext, useWatch } from "react-hook-form";

import useMaterial from "@/features/Material/useMaterial";
import useVariantData from "@/features/Variant/useVariant";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function VariantPicker() {
  const { getMap: materialsMap } = useMaterial();
  const { getActiveData, getMap } = useVariantData();
  const { control, setValue } = useFormContext<SupplyFormValues>();
  const materialString = useWatch({ control, name: "materialId" });
  const material = Number(materialString);
  const materials = materialsMap();
  const variants = getActiveData();
  const variantsMap = getMap();

  const chosenMaterialId = material && materials.get(material)?.id;
  const options = variants.reduce<OptionPickerOption[]>((prev, cur) => {
    if (!chosenMaterialId || cur.material_id === chosenMaterialId) {
      return [
        ...prev,
        {
          value: String(cur.id),
          label: cur.name,
        },
      ];
    } else return prev;
  }, []);

  function onSelect(value: string) {
    const unit = variantsMap.get(Number(value))?.unit;
    if (unit) setValue("unit", unit, writeOptions);
  }

  return (
    <FormOptionPicker
      control={control}
      name="variantId"
      label="Вариант"
      options={options}
      onSelect={onSelect}
    />
  );
}
