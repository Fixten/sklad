import { useFormContext, useWatch } from "react-hook-form";

import useMaterial from "@/features/Material/useMaterial";
import { UnitOptions } from "@/features/units";
import useVariant from "@/features/Variant/useVariant";
import { FormSelectField } from "@ui/SelectField";

import type { SupplyFormValues } from "../../supplyForm";

export default function UnitPicker() {
  const { materials } = useMaterial();
  const { variants } = useVariant();
  const { control } = useFormContext<SupplyFormValues>();
  const material = useWatch({ control, name: "material" });
  const variant = useWatch({ control, name: "variant" });

  const chosenMaterialId = materials.find((item) => item.name === material)?.id;
  const existing = variants.find(
    (item) => item.material_id === chosenMaterialId && item.name === variant,
  );

  return (
    <FormSelectField
      control={control}
      name="unit"
      label="Единица"
      options={UnitOptions}
      disabled={Boolean(existing)}
    />
  );
}
