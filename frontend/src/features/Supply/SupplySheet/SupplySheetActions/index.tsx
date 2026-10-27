import { Button } from "@ui/Button";

import { useSupplySheetContext } from "../context";
import { SupplyStepKind } from "../supplySteps";

export default function SupplySheetActions() {
  const { step, close, back, submitDetails } = useSupplySheetContext();

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
          <Button onClick={submitDetails}>Сохранить поставку</Button>
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
