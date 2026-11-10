import { useFormContext } from "react-hook-form";

import { UnitOptions } from "@/features/units";
import { FormSelectField } from "@ui/SelectField";

import type { SupplyFormValues } from "../../supplyForm";

import { writeOptions } from "./writeOptions";

export default function UnitPicker() {
  const { control, setValue } = useFormContext<SupplyFormValues>();

  function onValueChange() {
    setValue("variant", "", writeOptions);
  }

  return (
    <FormSelectField
      control={control}
      name="unit"
      label="Единица"
      options={UnitOptions}
      onValueChange={onValueChange}
    />
  );
}
