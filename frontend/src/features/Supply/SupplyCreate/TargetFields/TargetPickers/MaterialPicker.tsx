import { useFormContext, useWatch } from "react-hook-form";

import useMaterial from "@/features/Material/useMaterial";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function MaterialPicker() {
  const { getAllData } = useMaterial();
  const { getMap: typesMap } = useMaterialType();
  const { control, setValue } = useFormContext<SupplyFormValues>();
  const materials = getAllData();
  const types = typesMap();

  const typeString = useWatch({ control, name: "typeId" });
  const type = Number(typeString);
  const materialString = useWatch({ control, name: "materialId" });
  const material = Number(materialString);

  const chosenTypeId = type && types.get(type)?.id;
  const options = materials.reduce<OptionPickerOption[]>((prev, cur) => {
    if (
      typeof chosenTypeId === "undefined" ||
      cur.material_type_id === chosenTypeId
    ) {
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
    if (Number(value) !== material) {
      setValue("variantId", "", writeOptions);
      setValue("unit", "", writeOptions);
    }
  }

  return (
    <FormOptionPicker
      control={control}
      name="materialId"
      label="Материал"
      options={options}
      canCreate
      onSelect={onSelect}
    />
  );
}
