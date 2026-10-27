import {
  queryMaterialRow,
  queryMaterialRowWithType,
  type CreationTarget,
} from "@/features/Material/materialUtils/materiaUtils";
import useMaterialsCatalog, {
  type MaterialCatalogRow,
} from "@/features/Material/useMaterialsCatalog";

import { useSupplySheetContext } from "../../context";
import { SupplyStepKind } from "../../supplySteps";

export function usePickStep() {
  const { query, setQuery, go } = useSupplySheetContext();
  const catalog = useMaterialsCatalog();

  const matchedRows = queryMaterialRow(catalog.rows, query);
  const creation = queryMaterialRowWithType(catalog.rows, query);

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
    query,
    setQuery,
    matchedRows,
    creation,
    selectVariant,
    selectCreation,
  };
}
