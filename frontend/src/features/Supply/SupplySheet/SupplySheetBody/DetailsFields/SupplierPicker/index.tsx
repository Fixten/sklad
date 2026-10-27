import { normalizeName, sameName } from "@/lib/text/text";
import OptionPicker from "@ui/OptionPicker";

export interface SupplierOption {
  id: number;
  name: string;
}

interface Props {
  suppliers: SupplierOption[];
  value: { id: number | null; name: string };
  error?: string;
  onChange: (value: { id: number | null; name: string }) => void;
}

export default function SupplierPicker({
  suppliers,
  value,
  error,
  onChange,
}: Props) {
  const needle = normalizeName(value.name);
  const matched = needle
    ? suppliers.filter((supplier) =>
        normalizeName(supplier.name).includes(needle),
      )
    : suppliers;
  const creationName = value.name.trim();
  const hasExactMatch = suppliers.some((supplier) =>
    sameName(supplier.name, creationName),
  );
  const withCreation = Boolean(creationName) && !hasExactMatch;

  const createRow = withCreation
    ? {
        createLabel: `Новый поставщик: «${creationName}»`,
        onCreate: () => {
          onChange({ id: null, name: creationName });
        },
      }
    : {};

  return (
    <OptionPicker
      id="supply-supplier"
      label="Поставщик"
      placeholder="Например, Столярный двор"
      value={value.name}
      error={error}
      onValueChange={(next) => {
        onChange({ id: null, name: next });
      }}
      onSelect={(supplier) => {
        onChange({ id: supplier.id, name: supplier.name });
      }}
      listLabel="Поставщики"
      results={matched.map((supplier) => ({
        key: String(supplier.id),
        value: supplier,
        label: supplier.name,
      }))}
      {...createRow}
    />
  );
}
