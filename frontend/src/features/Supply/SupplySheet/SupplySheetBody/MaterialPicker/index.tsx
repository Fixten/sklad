import {
  materialPath,
  type CreationTarget,
} from "@/features/Material/materialUtils/materiaUtils";
import OptionPicker from "@ui/OptionPicker";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

interface Props {
  query: string;
  rows: MaterialCatalogRow[];
  creation: CreationTarget | null;
  onQueryChange: (query: string) => void;
  onSelect: (row: MaterialCatalogRow) => void;
  onCreate: (target: CreationTarget) => void;
}

export default function MaterialPicker({
  query,
  rows,
  creation,
  onQueryChange,
  onSelect,
  onCreate,
}: Props) {
  const creationLabel =
    creation?.kind === "variant"
      ? `Новый вариант в «${creation.material.name}»`
      : `Новый материал: «${query.trim()}»`;

  const create = creation
    ? {
        createLabel: creationLabel,
        onCreate: () => {
          onCreate(creation);
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
      onValueChange={onQueryChange}
      onSelect={onSelect}
      listLabel="Варианты"
      results={rows.map((row) => ({
        key: String(row.variantId),
        value: row,
        label: row.variantName,
        meta: materialPath(row.material),
      }))}
      create={create}
    />
  );
}
