import OptionPicker from "@ui/OptionPicker";

import {
  materialPath,
  type CreationTarget,
} from "../../supplySearch/supplySearch";

import type { MaterialCatalogRow } from "../../../Material/useMaterialsCatalog";

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
  const hasQuery = query.trim().length > 0;

  const creationLabel =
    creation?.kind === "variant"
      ? `Новый вариант в «${creation.material.name}»`
      : `Новый материал: «${query.trim()}»`;

  const createRow = creation
    ? {
        createLabel: creationLabel,
        onCreate: () => {
          onCreate(creation);
        },
      }
    : {};

  return (
    <OptionPicker
      id="supply-material"
      label="Материал"
      placeholder="Название, тип или вариант"
      hint={hasQuery ? "Поиск по названию, типу и варианту." : undefined}
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
      {...createRow}
    />
  );
}
