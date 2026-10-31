import useMaterial from "@/features/Material/useMaterial";
import { buildMaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useVariant from "@/features/Variant/useVariant";

import { SupplyStepKind } from "../../supplySteps";
import { supplyWizard } from "../../supplyWizard";

import type { MaterialDraft } from "./materialDraft";

export function useMaterialStep() {
  const wizard = supplyWizard.useWizard();
  const material = useMaterial();
  const materialType = useMaterialType();
  const variant = useVariant();

  const types = (materialType.query.data ?? []).filter(
    (row) => !row.deleted_at,
  );

  const create = async (draft: MaterialDraft) => {
    await wizard.advance(
      async () => {
        const typeId =
          draft.type.kind === "new"
            ? (await materialType.addMutation.mutateAsync(draft.type.name)).id
            : draft.type.id;
        const createdMaterial = await material.addMutation.mutateAsync({
          name: draft.materialName,
          material_type_id: typeId,
        });
        const createdVariant = await variant.addMutation.mutateAsync({
          name: draft.variantName,
          unit: draft.unit,
          material_id: createdMaterial.id,
        });

        return buildMaterialCatalogRow(
          createdVariant,
          createdMaterial,
          draft.type.name,
        );
      },
      (row) => ({ kind: SupplyStepKind.Details, row }),
    );
  };

  return {
    types,
    query: wizard.shared.query,
    create,
    pending: wizard.pending,
  };
}
