import { normalizeName, sameName } from "@/lib/text/text";
import OptionPicker from "@ui/OptionPicker";

import type { SupplierValue } from "../detailsForm";
import type { ComponentProps, Ref } from "react";

export interface SupplierOption {
  id: number;
  name: string;
}

interface Props {
  suppliers: SupplierOption[];
  value: SupplierValue;
  name?: string;
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  onChange: (value: SupplierValue) => void;
  onBlur?: ComponentProps<"input">["onBlur"];
}

export default function SupplierPicker({
  suppliers,
  value,
  name,
  inputRef,
  error,
  onChange,
  onBlur,
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

  const create = withCreation
    ? {
        createLabel: `Новый поставщик: «${creationName}»`,
        onCreate: () => {
          onChange({ id: null, name: creationName });
        },
      }
    : undefined;

  return (
    <OptionPicker
      id="supply-supplier"
      name={name}
      inputRef={inputRef}
      label="Поставщик"
      placeholder="Например, Столярный двор"
      value={value.name}
      error={error}
      onBlur={onBlur}
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
      create={create}
    />
  );
}
