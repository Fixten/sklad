import useVariant from "@/features/Variant/useVariant";

import { SupplyStepKind } from "../../supplySteps";
import { supplyWizard } from "../../supplyWizard";

import type { VariantDraft } from "./useVariantForm";
import type { MaterialTarget } from "@/features/Material/useMaterialsCatalog";

export function useVariantStep(material: MaterialTarget) {
  const { run } = supplyWizard.useWizard();
  const variant = useVariant();

  const create = async (draft: VariantDraft) => {
    await run(async () => {
      const created = await variant.addMutation.mutateAsync({
        name: draft.name,
        unit: draft.unit,
        material_id: material.id,
      });

      return {
        kind: SupplyStepKind.Details,
        row: {
          variantId: created.id,
          variantName: created.name,
          unit: created.unit,
          material,
        },
      };
    });
  };

  return {
    pending: variant.addMutation.isPending,
    create,
  };
}
