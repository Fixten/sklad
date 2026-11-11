import { useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import useSupplyCreateStep from "./useSupplyCreateStep";

const supplyFormSchema = createSupplyFormSchema();

export default function useSupplyCreateForm() {
  const step = useSupplyCreateStep();
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: supplyFormDefaults,
  });

  return { form, submit: step.submit };
}
