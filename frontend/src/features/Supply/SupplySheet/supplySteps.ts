import type {
  MaterialCatalogRow,
  MaterialTarget,
} from "@/features/Material/useMaterialsCatalog";

export enum SupplyStepKind {
  Pick = "pick",
  Variant = "variant",
  Material = "material",
  Details = "details",
}

export const supplyDetailsFormId = "supply-details-form";

export type SupplyStep =
  | { kind: SupplyStepKind.Pick }
  | { kind: SupplyStepKind.Variant; material: MaterialTarget }
  | { kind: SupplyStepKind.Material }
  | { kind: SupplyStepKind.Details; row: MaterialCatalogRow };

export const supplyInitialStep: SupplyStep = { kind: SupplyStepKind.Pick };

export const supplyBackStep = (step: SupplyStep): SupplyStep | null =>
  step.kind === SupplyStepKind.Pick ? null : supplyInitialStep;

const stepNumbers: Record<SupplyStep["kind"], string> = {
  [SupplyStepKind.Pick]: "01 / 02",
  [SupplyStepKind.Variant]: "01 / 02",
  [SupplyStepKind.Material]: "01 / 02",
  [SupplyStepKind.Details]: "02 / 02",
};

export const stepLabel = (step: SupplyStep) => stepNumbers[step.kind];
