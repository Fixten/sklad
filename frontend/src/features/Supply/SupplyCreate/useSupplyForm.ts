import { useWatch } from "react-hook-form";

import { useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

const supplyFormSchema = createSupplyFormSchema();

export function useSupplyForm() {
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: supplyFormDefaults,
  });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const price = useWatch({ control: form.control, name: "price" });
  const unit = useWatch({ control: form.control, name: "unit" });

  const setTarget = (row: MaterialCatalogRow) => {
    form.setValue("variantId", row.variantId, { shouldDirty: true });
    form.setValue("unit", row.unit, { shouldDirty: true });
    form.setValue("typeId", row.material.materialTypeId, { shouldDirty: true });
    form.setValue("typeName", row.material.materialTypeName, {
      shouldDirty: true,
    });
    form.setValue("materialId", row.material.id, { shouldDirty: true });
    form.setValue("materialName", row.material.name, { shouldDirty: true });
    form.setValue("variantName", row.variantName, { shouldDirty: true });
    form.clearErrors([
      "variantId",
      "unit",
      "typeName",
      "materialName",
      "variantName",
    ]);
  };

  const clearQueryTarget = () => {
    form.setValue("variantId", null);
    form.clearErrors(["variantId"]);
  };

  const submit = () => undefined;

  return {
    form,
    quantity,
    price,
    unit,
    submit,
    setTarget,
    clearQueryTarget,
  };
}
