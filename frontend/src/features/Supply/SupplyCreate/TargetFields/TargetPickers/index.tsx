import { FieldGroup } from "@ui/InputFieldGroup";

import MaterialPicker from "./MaterialPicker";
import TypePicker from "./TypePicker";
import UnitPicker from "./UnitPicker";
import VariantPicker from "./VariantPicker";

export default function TargetPickers() {
  return (
    <FieldGroup className="grid gap-5 sm:grid-cols-2">
      <TypePicker />
      <MaterialPicker />
      <VariantPicker />
      <UnitPicker />
    </FieldGroup>
  );
}
