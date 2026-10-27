import { createWizard } from "@/lib/wizard/createWizard";

import { supplyInitialStep, SupplyStep, SupplyStepKind } from "./supplySteps";

export interface SupplyShared {
  query: string;
  setQuery: (query: string) => void;
}

export const supplyWizard = createWizard<SupplyStep, SupplyShared>({
  initialStep: supplyInitialStep,
  getBackStep: (step) =>
    step.kind === SupplyStepKind.Pick ? null : supplyInitialStep,
});
