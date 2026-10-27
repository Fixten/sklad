import {
  queryMaterialRow,
  queryMaterialRowWithType,
  type CreationTarget,
} from "@/features/Material/materialUtils/materiaUtils";
import useMaterialsCatalog, {
  type MaterialCatalogRow,
} from "@/features/Material/useMaterialsCatalog";

import { SupplyStepKind } from "../../supplySteps";
import { supplyWizard } from "../../supplyWizard";

export function usePickStep() {
  const { shared, go } = supplyWizard.useWizard();
  const catalog = useMaterialsCatalog();

  const matchedRows = queryMaterialRow(catalog.rows, shared.query);
  const creation = queryMaterialRowWithType(catalog.rows, shared.query);

  const selectVariant = (row: MaterialCatalogRow) => {
    go({ kind: SupplyStepKind.Details, row });
  };

  const selectCreation = (target: CreationTarget) => {
    go(
      target.kind === "variant"
        ? { kind: SupplyStepKind.Variant, material: target.material }
        : { kind: SupplyStepKind.Material },
    );
  };

  return {
    query: shared.query,
    setQuery: shared.setQuery,
    matchedRows,
    creation,
    selectVariant,
    selectCreation,
  };
}
