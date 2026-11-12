import SelectField from "@ui/SelectField";

import {
  CATALOG_LEVELS,
  parseCatalogLevel,
  type CatalogLevel,
} from "../levels";

const levelOptions = CATALOG_LEVELS.map(({ key, label }) => ({
  value: key,
  label,
}));

interface Props {
  value: CatalogLevel;
  onChange: (value: CatalogLevel) => void;
}

export default function LevelSwitcher(props: Props) {
  function handleValueChange(value: string) {
    props.onChange(parseCatalogLevel(value));
  }

  return (
    <SelectField
      label="Уровень"
      options={levelOptions}
      value={props.value}
      onValueChange={handleValueChange}
    />
  );
}
