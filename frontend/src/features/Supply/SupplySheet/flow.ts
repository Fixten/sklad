import type {
  MaterialCatalogRow,
  MaterialTarget,
} from "../../Material/useMaterialsCatalog";

export type SupplyStep =
  | { kind: "pick" }
  | { kind: "variant"; material: MaterialTarget }
  | { kind: "material" }
  | { kind: "details"; row: MaterialCatalogRow };

export const supplyInitialStep: SupplyStep = { kind: "pick" };

export const supplyBackStep: SupplyStep = { kind: "pick" };

const isDetailsStep = (
  step: SupplyStep,
): step is Extract<SupplyStep, { kind: "details" }> => step.kind === "details";

export const stepLabel = (step: SupplyStep) =>
  isDetailsStep(step) ? "02 / 02" : "01 / 02";
