import { useFormContext } from "react-hook-form";

import useVariantsCatalog, {
  type CatalogItemWithName,
} from "@/features/Variant/useVariantsCatalog";
import OptionPicker from "@ui/OptionPicker";

import type { SupplyFormValues } from "../../supplyForm";

const writeOptions = { shouldDirty: true, shouldValidate: true } as const;

export default function SearchField() {
  const { isLoading, getCatalogWithNames } = useVariantsCatalog();
  const { setValue } = useFormContext<SupplyFormValues>();

  function applyTarget(row: CatalogItemWithName) {
    setValue("typeId", String(row.type.id), writeOptions);
    setValue("materialId", String(row.material.id), writeOptions);
    setValue("variantId", String(row.variant.id), writeOptions);
    setValue("unit", row.unit, writeOptions);
  }

  const catalog = getCatalogWithNames();
  const options = catalog.map((item) => ({
    value: String(item.variant.id),
    label: item.variant.name,
    keywords: [item.type.name, item.material.name],
  }));

  function onSelect(value: string | number) {
    const variant = catalog.find((v) => v.variant.id === Number(value));
    if (variant) applyTarget(variant);
  }

  return (
    <OptionPicker
      label="Поиск"
      listLabel="Варианты"
      placeholder="Название, тип или вариант"
      loading={isLoading}
      options={options}
      onSelect={onSelect}
    />
  );
}
