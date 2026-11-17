import { ApiError } from "@/api/api-error";
import { useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import type { SupplyDraft } from "./supplyForm";
import useSupplyCreateSubmit from "./useSupplyCreateSubmit";

const supplyFormSchema = createSupplyFormSchema();

export default function useSupplyCreateForm() {
  const { submit } = useSupplyCreateSubmit();
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: supplyFormDefaults,
  });

  const onSubmit = async (values: SupplyDraft) => {
    form.rootError.clear();

    try {
      await submit(values);
    } catch (error) {
      form.rootError.set(
        error instanceof ApiError
          ? error.message
          : "Не удалось создать поставку",
      );
    }
  };

  return { form, onSubmit };
}
