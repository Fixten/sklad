import { useFormContext } from "react-hook-form";

import useMaterialsCatalog, {
  type MaterialCatalogRow,
} from "@/features/Material/useMaterialsCatalog";
import OptionPicker from "@ui/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

const writeOptions = { shouldDirty: true } as const;

export default function SearchField() {
  const catalog = useMaterialsCatalog();
  const { setValue } = useFormContext<SupplyFormValues>();

  function applyTarget(row: MaterialCatalogRow) {
    setValue("type", row.material.materialTypeName, writeOptions);
    setValue("material", row.material.name, writeOptions);
    setValue("variant", row.variantName, writeOptions);
    setValue("unit", row.unit, writeOptions);
  }

  const options = catalog.rows.map((row) => ({
    value: String(row.variantId),
    label: row.variantName,
    keywords: [row.material.materialTypeName, row.material.name],
  }));

  function onSelect(value: string) {
    const row = catalog.rows.find((v) => String(v.variantId) === value);
    if (row) applyTarget(row);
  }

  return (
    <OptionPicker
      label="Поиск"
      placeholder="Название, тип или вариант"
      loading={catalog.isLoading}
      options={options}
      onSelect={onSelect}
    />
  );
}
