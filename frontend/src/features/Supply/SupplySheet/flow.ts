import type {
  MaterialCatalogRow,
  MaterialTarget,
} from "../../Material/useMaterialsCatalog";

export enum SupplyStepKind {
  Pick = "pick",
  Variant = "variant",
  Material = "material",
  Details = "details",
}

export type SupplyStep =
  | { kind: SupplyStepKind.Pick }
  | { kind: SupplyStepKind.Variant; material: MaterialTarget }
  | { kind: SupplyStepKind.Material }
  | { kind: SupplyStepKind.Details; row: MaterialCatalogRow };

export const supplyInitialStep: SupplyStep = { kind: SupplyStepKind.Pick };

export const supplyBackStep: SupplyStep = { kind: SupplyStepKind.Pick };

const isDetailsStep = (
  step: SupplyStep,
): step is Extract<SupplyStep, { kind: SupplyStepKind.Details }> =>
  step.kind === SupplyStepKind.Details;

export const stepLabel = (step: SupplyStep) =>
  isDetailsStep(step) ? "02 / 02" : "01 / 02";
