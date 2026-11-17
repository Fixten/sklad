import { useFormContext } from "react-hook-form";

import { UnitOptions } from "@/features/units";
import { FormSelectField } from "@ui/SelectField";

import type { SupplyFormValues } from "../../supplyForm";

export default function UnitPicker() {
  const { control } = useFormContext<SupplyFormValues>();

  return (
    <FormSelectField
      control={control}
      name="unit"
      label="Единица"
      options={UnitOptions}
      disabled
    />
  );
}
