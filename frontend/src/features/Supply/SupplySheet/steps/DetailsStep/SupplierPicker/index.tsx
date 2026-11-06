import type { ComponentProps, Ref } from "react";

import { normalizeName, sameName } from "@/lib/text/text";
import OptionPicker from "@ui/OptionPicker";

import type { SupplierValue } from "../detailsForm";

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
      query={value.name}
      error={error}
      onBlur={onBlur}
      onQueryChange={(next) => {
        onChange({ id: null, name: next });
      }}
      onSelect={(supplierId) => {
        const supplier = matched.find(
          (candidate) => candidate.id === supplierId,
        );

        if (!supplier) return;

        onChange({ id: supplier.id, name: supplier.name });
      }}
      listLabel="Поставщики"
      options={matched.map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      }))}
      create={create}
    />
  );
}
