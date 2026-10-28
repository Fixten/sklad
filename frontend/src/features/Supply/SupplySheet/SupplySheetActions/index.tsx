import { Button } from "@ui/Button";

import { SupplyStepKind, supplyDetailsFormId } from "../supplySteps";
import { supplyWizard } from "../supplyWizard";

export default function SupplySheetActions() {
  const { step, close, back, busy } = supplyWizard.useWizard();

  const cancelButton = (
    <Button variant="ghost" onClick={close}>
      Отмена
    </Button>
  );

  const backButton = (
    <Button variant="ghost" onClick={back}>
      Назад
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
            pending={busy}
            pendingLabel="Сохраняем…"
          >
            Сохранить поставку
          </Button>
        </>
      );

    case SupplyStepKind.Pick:
      return cancelButton;

    default:
      return (
        <>
          {backButton}
          {cancelButton}
        </>
      );
  }
}
