import { useWatch } from "react-hook-form";

import { useZodForm } from "@ui/Form";

import {
  createDetailsFormSchema,
  detailsFormDefaults,
  unitCostPreview,
} from "./detailsForm";
import { useDetailsStep } from "./useDetailsStep";

import type { DetailsDraft } from "./detailsForm";
import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

export function useDetailsForm(row: MaterialCatalogRow) {
  const form = useZodForm({
    schema: createDetailsFormSchema(row.unit),
    defaultValues: detailsFormDefaults,
  });
  const { suppliers, save } = useDetailsStep(row);
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const price = useWatch({ control: form.control, name: "price" });
  const { isSubmitting } = form.formState;

  const submit = async (draft: DetailsDraft) => {
    if (isSubmitting) return;

    await save(draft);
  };

  return {
    form,
    busy: isSubmitting,
    suppliers,
    unitCost: unitCostPreview({ quantity, price }, row.unit),
    submit,
  };
}
