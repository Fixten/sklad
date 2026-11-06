import { useWatch } from "react-hook-form";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";
import { useZodForm } from "@ui/Form";

import {
  createDetailsFormSchema,
  detailsFormDefaults,
  unitCostPreview,
} from "./detailsForm";
import { useDetailsStep } from "./useDetailsStep";

export function useDetailsForm(row: MaterialCatalogRow) {
  const form = useZodForm({
    schema: createDetailsFormSchema(row.unit),
    defaultValues: detailsFormDefaults,
  });
  const { suppliers, save, pending } = useDetailsStep(row);
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const price = useWatch({ control: form.control, name: "price" });
  const { isSubmitting } = form.formState;
  const busy = pending || isSubmitting;

  return {
    form,
    busy,
    suppliers,
    unitCost: unitCostPreview({ quantity, price }, row.unit),
    submit: save,
  };
}
