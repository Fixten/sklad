import { useState } from "react";
import { useWatch } from "react-hook-form";

import { queryMaterialRow } from "@/features/Material/materialUtils/materiaUtils";
import useMaterialsCatalog, {
  type MaterialCatalogRow,
} from "@/features/Material/useMaterialsCatalog";
import { unitCostPreview } from "@/features/Supply/supplyFormRules";
import { UnitShortLabels } from "@/features/units";
import { formatAmount } from "@/lib/amount";
import { useZodForm } from "@ui/Form";

import {
  createSupplyFormSchema,
  supplyFormDefaults,
  type SupplyDraft,
} from "./supplyForm";

export function useSupplyCreate() {
  const catalog = useMaterialsCatalog();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MaterialCatalogRow | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const form = useZodForm({
    schema: createSupplyFormSchema(),
    defaultValues: supplyFormDefaults,
  });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const price = useWatch({ control: form.control, name: "price" });
  const unit = selected?.unit ?? null;
  const results = selected ? [] : queryMaterialRow(catalog.rows, query);
  const unitCost = unit ? unitCostPreview({ quantity, price }, unit) : null;

  const changeQuery = (value: string) => {
    setQuery(value);
    setStatus(null);

    if (selected) {
      setSelected(null);
      form.setValue("variantId", null);
      form.setValue("unit", null);
      form.clearErrors(["variantId", "unit"]);
    }
  };

  const select = (row: MaterialCatalogRow) => {
    setSelected(row);
    setQuery(row.variantName);
    setStatus(null);
    form.setValue("variantId", row.variantId, { shouldDirty: true });
    form.setValue("unit", row.unit, { shouldDirty: true });
    form.clearErrors(["variantId", "unit"]);
  };

  const submit = (draft: SupplyDraft) => {
    setStatus(
      `Форма проверена: ${formatAmount(draft.quantity)} ${UnitShortLabels[draft.unit]}, ${draft.supplierName}. Сохранение появится на следующем слое.`,
    );
  };

  return {
    form,
    query,
    results,
    selected,
    unit,
    unitCost,
    status,
    isLoading: catalog.isLoading,
    changeQuery,
    select,
    submit,
  };
}
