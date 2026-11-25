import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

import { ApiError } from "@/api/api-error";
import useMaterialData from "@/features/Material/useMaterial";
import useVariantData from "@/features/Variant/useVariant";
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
  const [searchParams] = useSearchParams();
  const variants = useVariantData();
  const materials = useMaterialData();
  const variant = variants
    .getActiveData()
    .find((row) => row.id === Number(searchParams.get("variant")));
  const material = variant
    ? materials.getMap().get(variant.material_id)
    : undefined;
  const prefilled = useRef(false);

  useEffect(() => {
    if (prefilled.current || !variant || !material || form.formState.isDirty) {
      return;
    }
    prefilled.current = true;
    form.reset({
      ...supplyFormDefaults,
      typeId: String(material.material_type_id),
      materialId: String(material.id),
      variantId: String(variant.id),
      unit: variant.unit,
    });
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
