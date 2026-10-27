import MaterialStep from "../MaterialStep";

import DetailsFields from "./DetailsFields";
import { SupplyStepKind, type SupplyStep } from "./flow";
import MaterialPicker from "./MaterialPicker";
import VariantStep from "./VariantStep";

import type {
  DetailsErrors,
  DetailsForm,
  UnitCostPreview,
} from "./detailsForm";
import type { MaterialDraft } from "./materialDraft";
import type {
  MaterialCatalogRow,
  MaterialTarget,
} from "../../../Material/useMaterialsCatalog";
import type { CreationTarget } from "../../supplySearch/supplySearch";
import type { SupplierOption } from "../SupplierPicker";
import type { Unit } from "@/features/units";

interface Props {
  step: SupplyStep;
  query: string;
  matchedRows: MaterialCatalogRow[];
  creation: CreationTarget | null;
  details: DetailsForm;
  detailsErrors: DetailsErrors;
  supplierOptions: SupplierOption[];
  unitCost: UnitCostPreview | null;
  types: { id: number; name: string }[];
  variantPending: boolean;
  materialPending: boolean;
  onQueryChange: (query: string) => void;
  onSelectVariant: (row: MaterialCatalogRow) => void;
  onSelectCreation: (target: CreationTarget) => void;
  onCreateVariant: (
    material: MaterialTarget,
    name: string,
    unit: Unit,
  ) => Promise<void>;
  onCreateMaterial: (draft: MaterialDraft) => Promise<void>;
  onUpdateDetails: (patch: Partial<DetailsForm>) => void;
  onClearDetailsError: (key: keyof DetailsErrors) => void;
}

export default function SupplySheetBody({
  step,
  query,
  matchedRows,
  creation,
  details,
  detailsErrors,
  supplierOptions,
  unitCost,
  types,
  variantPending,
  materialPending,
  onQueryChange,
  onSelectVariant,
  onSelectCreation,
  onCreateVariant,
  onCreateMaterial,
  onUpdateDetails,
  onClearDetailsError,
}: Props) {
  switch (step.kind) {
    case SupplyStepKind.Pick:
      return (
        <MaterialPicker
          query={query}
          rows={matchedRows}
          creation={creation}
          onQueryChange={onQueryChange}
          onSelect={onSelectVariant}
          onCreate={onSelectCreation}
        />
      );

    case SupplyStepKind.Variant:
      return (
        <VariantStep
          material={step.material}
          pending={variantPending}
          onCreate={(name, unit) => onCreateVariant(step.material, name, unit)}
        />
      );

    case SupplyStepKind.Material:
      return (
        <MaterialStep
          types={types}
          initialName={query.trim()}
          pending={materialPending}
          onCreate={onCreateMaterial}
        />
      );

    case SupplyStepKind.Details:
      return (
        <DetailsFields
          row={step.row}
          details={details}
          errors={detailsErrors}
          suppliers={supplierOptions}
          unitCost={unitCost}
          onChange={onUpdateDetails}
          onClearError={onClearDetailsError}
        />
      );
  }
}
