import useMaterial from "@/features/Material/useMaterial";
import { buildMaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useVariant from "@/features/Variant/useVariant";

import { SupplyStepKind } from "../../supplySteps";
import { supplyWizard } from "../../supplyWizard";

import type { MaterialDraft } from "./materialDraft";

export function useMaterialStep() {
  const { run } = supplyWizard.useWizard();
  const material = useMaterial();
  const materialType = useMaterialType();
  const variant = useVariant();

  const types = (materialType.query.data ?? []).filter(
    (row) => !row.deleted_at,
  );

  const pending =
    material.addMutation.isPending ||
    materialType.addMutation.isPending ||
    variant.addMutation.isPending;

  const create = async (draft: MaterialDraft) => {
    await run(async () => {
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

      return {
        kind: SupplyStepKind.Details,
        row: buildMaterialCatalogRow(
          createdVariant,
          createdMaterial,
          draft.type.name,
        ),
      };
    });
  };

  return {
    types,
    pending,
    create,
  };
}
