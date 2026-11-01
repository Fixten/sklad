import { useWatch } from "react-hook-form";

import { useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";

import type { Unit } from "@/features/units";

interface SupplyTarget {
  variantId: number;
  unit: Unit;
}

const supplyFormSchema = createSupplyFormSchema();

export function useSupplyForm() {
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: supplyFormDefaults,
  });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const price = useWatch({ control: form.control, name: "price" });

  const setTarget = ({ variantId, unit }: SupplyTarget) => {
    form.setValue("variantId", variantId, { shouldDirty: true });
    form.setValue("unit", unit, { shouldDirty: true });
    form.clearErrors(["variantId", "unit"]);
  };

  const clearTarget = () => {
    form.setValue("variantId", null);
    form.setValue("unit", null);
    form.clearErrors(["variantId", "unit"]);
  };

  const submit = () => undefined;

  return {
    form,
    quantity,
    price,
    submit,
    setTarget,
    clearTarget,
  };
}
