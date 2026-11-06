import type { MaterialTarget } from "@/features/Material/useMaterialsCatalog";
import useVariant from "@/features/Variant/useVariant";

import { SupplyStepKind } from "../../supplySteps";
import { supplyWizard } from "../../supplyWizard";

import type { VariantDraft } from "./useVariantForm";

export function useVariantStep(material: MaterialTarget) {
  const wizard = supplyWizard.useWizard();
  const variant = useVariant();

  const create = async (draft: VariantDraft) => {
    await wizard.advance(
      () =>
        variant.addMutation.mutateAsync({
          name: draft.name,
          unit: draft.unit,
          material_id: material.id,
        }),
      (created) => ({
        kind: SupplyStepKind.Details,
        row: {
          variantId: created.id,
          variantName: created.name,
          unit: created.unit,
          material,
        },
      }),
    );
  };

  return { create, pending: wizard.pending };
}
