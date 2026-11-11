import { useState } from "react";

import { ApiError } from "@/api/api-error";
import { useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import type { SupplyDraft } from "./supplyForm";
import useSupplyCreateStep from "./useSupplyCreateStep";

const supplyFormSchema = createSupplyFormSchema();

export default function useSupplyCreateForm() {
  const step = useSupplyCreateStep();
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: supplyFormDefaults,
  });
  const [error, setError] = useState<string | undefined>();

  const onSubmit = async (values: SupplyDraft) => {
    setError(undefined);

    try {
      await step.submit(values);
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Не удалось создать поставку",
      );
    }
  };

  return { form, onSubmit, error };
}
