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
  const wizard = supplyWizard.useWizard();
  const catalog = useMaterialsCatalog();

  const query = wizard.shared.query;
  const setQuery = (next: string) => {
    wizard.setShared({ query: next });
  };

  const matchedRows = queryMaterialRow(catalog.rows, query);
  const creation = queryMaterialRowWithType(catalog.rows, query);

  const selectVariant = (row: MaterialCatalogRow) => {
    wizard.go({ kind: SupplyStepKind.Details, row });
  };

  const selectCreation = (target: CreationTarget) => {
    wizard.go(
      target.kind === "variant"
        ? { kind: SupplyStepKind.Variant, material: target.material }
        : { kind: SupplyStepKind.Material },
    );
  };

  return {
    query,
    setQuery,
    matchedRows,
    creation,
    selectVariant,
    selectCreation,
  };
}
