import { createWizard } from "@/lib/wizard/createWizard";

import { supplyBackStep, supplyInitialStep, SupplyStep } from "./supplySteps";

export interface SupplyShared {
  query: string;
}

export const supplyWizard = createWizard<SupplyStep, SupplyShared>({
  initialStep: supplyInitialStep,
  initialShared: { query: "" },
  getBackStep: supplyBackStep,
  failureMessage: "Не удалось сохранить",
});
