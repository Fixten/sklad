import { FieldGroup } from "@ui/InputFieldGroup";

import TargetPickers from "../TargetPickers";
import { useMaterialSearch } from "../useMaterialSearch";

import SearchField from "./SearchField";

export default function TargetFields() {
  const search = useMaterialSearch();

  return (
    <FieldGroup className="gap-6">
      <SearchField search={search} />
      <TargetPickers onChainEdit={search.clear} />
    </FieldGroup>
  );
}
