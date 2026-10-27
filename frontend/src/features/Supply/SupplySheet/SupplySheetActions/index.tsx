import { Button } from "@ui/Button";

import { SupplyStepKind, type SupplyStep } from "../supplySteps";

interface Props {
  step: SupplyStep;
  onCancel: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function SupplySheetActions({
  step,
  onCancel,
  onBack,
  onSubmit,
}: Props) {
  const cancelButton = (
    <Button variant="ghost" onClick={onCancel}>
      Отмена
    </Button>
  );

  const backButton = (
    <Button variant="ghost" onClick={onBack}>
      Назад
    </Button>
  );

  switch (step.kind) {
    case SupplyStepKind.Details:
      return (
        <>
          {cancelButton}
          <Button onClick={onSubmit}>Сохранить поставку</Button>
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
