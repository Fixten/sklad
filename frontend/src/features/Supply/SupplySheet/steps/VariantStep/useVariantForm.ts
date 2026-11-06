import zod from "zod";

import type { MaterialTarget } from "@/features/Material/useMaterialsCatalog";
import { UnitSchema } from "@/features/units";
import { useZodForm } from "@ui/Form";

import { useVariantStep } from "./useVariantStep";

export const variantFormSchema = zod.object({
  name: zod.string().trim().min(1, "Укажите название варианта"),
  unit: UnitSchema,
});

export type VariantFormValues = zod.input<typeof variantFormSchema>;
export type VariantDraft = zod.output<typeof variantFormSchema>;

export const variantFormDefaults = {
  name: "",
  unit: "meters",
} satisfies VariantFormValues;

export function useVariantForm(material: MaterialTarget) {
  const form = useZodForm({
    schema: variantFormSchema,
    defaultValues: variantFormDefaults,
  });
  const { create, pending } = useVariantStep(material);
  const { isSubmitting } = form.formState;
  const busy = pending || isSubmitting;

  return { form, busy, submit: create };
}
