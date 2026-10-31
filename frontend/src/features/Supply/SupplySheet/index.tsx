import { Button } from "@ui/Button";
import Sheet from "@ui/Sheet";
import Typography from "@ui/Typography";

import DetailsStep from "./steps/DetailsStep";
import MaterialStep from "./steps/MaterialStep";
import PickStep from "./steps/PickStep";
import VariantStep from "./steps/VariantStep";
import SupplySheetActions from "./SupplySheetActions";
import { stepLabel, SupplyStepKind } from "./supplySteps";
import { supplyWizard } from "./supplyWizard";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StepRouter() {
  const { step } = supplyWizard.useWizard();

  switch (step.kind) {
    case SupplyStepKind.Pick:
      return <PickStep />;

    case SupplyStepKind.Variant:
      return <VariantStep material={step.material} />;

    case SupplyStepKind.Material:
      return <MaterialStep />;

    case SupplyStepKind.Details:
      return <DetailsStep row={step.row} />;
  }
}

function SupplySheetContent({ open }: { open: boolean }) {
  const { step, error, canGoBack, back, close } = supplyWizard.useWizard();

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
      title="Поставка материала"
      step={stepLabel(step)}
      hint={
        <Typography variant="label" className="text-muted-foreground m-0">
          ↑↓ Выбрать · Enter
        </Typography>
      }
      error={error}
      actions={<SupplySheetActions />}
      back={
        canGoBack ? (
          <Button variant="ghost" onClick={back}>
            Назад
          </Button>
        ) : undefined
      }
    >
      <StepRouter />
    </Sheet>
  );
}

export default function SupplySheet({ open, onOpenChange }: Props) {
  return (
    <supplyWizard.Provider
      onClose={() => {
        onOpenChange(false);
      }}
    >
      <SupplySheetContent open={open} />
    </supplyWizard.Provider>
  );
}
