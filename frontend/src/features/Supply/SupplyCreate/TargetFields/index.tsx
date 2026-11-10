import { FieldGroup } from "@ui/InputFieldGroup";

import SearchField from "./SearchField";
import TargetPickers from "./TargetPickers";

export default function TargetFields() {
  return (
    <FieldGroup className="gap-6">
      <SearchField />
      <TargetPickers />
    </FieldGroup>
  );
}
