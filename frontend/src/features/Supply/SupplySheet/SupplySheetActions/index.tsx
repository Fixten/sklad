import { Button } from "@ui/Button";

import { SupplyStepKind, supplyDetailsFormId } from "../supplySteps";
import { supplyWizard } from "../supplyWizard";

export default function SupplySheetActions() {
  const { step, close, pending } = supplyWizard.useWizard();

  const cancelButton = (
    <Button variant="ghost" onClick={close}>
      Отмена
    </Button>
  );

  switch (step.kind) {
    case SupplyStepKind.Details:
      return (
        <>
          {cancelButton}
          <Button
            type="submit"
            form={supplyDetailsFormId}
            pending={pending}
            pendingLabel="Сохраняем…"
          >
            Сохранить поставку
          </Button>
        </>
      );

    default:
      return cancelButton;
  }
}
