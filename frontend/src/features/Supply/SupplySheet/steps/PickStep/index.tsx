import { materialPath } from "@/features/Material/materialUtils/materiaUtils";
import OptionPicker from "@ui/OptionPicker";

import { usePickStep } from "./usePickStep";

export default function PickStep() {
  const {
    query,
    setQuery,
    matchedRows,
    creation,
    selectVariant,
    selectCreation,
  } = usePickStep();

  const creationLabel =
    creation?.kind === "variant"
      ? `Новый вариант в «${creation.material.name}»`
      : `Новый материал: «${query.trim()}»`;

  const create = creation
    ? {
        createLabel: creationLabel,
        onCreate: () => {
          selectCreation(creation);
        },
      }
    : undefined;

  return (
    <OptionPicker
      id="supply-material"
      label="Материал"
      placeholder="Название, тип или вариант"
      value={query}
      autoFocus
      onValueChange={setQuery}
      onSelect={selectVariant}
      listLabel="Варианты"
      results={matchedRows.map((row) => ({
        key: String(row.variantId),
        value: row,
        label: row.variantName,
        meta: materialPath(row.material),
      }))}
      create={create}
    />
  );
}
