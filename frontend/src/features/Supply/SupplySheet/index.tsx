import { Button } from "@ui/Button";
import Sheet from "@ui/Sheet";
import Typography from "@ui/Typography";

import { SupplySheetProvider, useSupplySheetContext } from "./context";
import DetailsStep from "./steps/DetailsStep";
import MaterialStep from "./steps/MaterialStep";
import PickStep from "./steps/PickStep";
import VariantStep from "./steps/VariantStep";
import SupplySheetActions from "./SupplySheetActions";
import { stepLabel, SupplyStepKind } from "./supplySteps";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StepRouter() {
  const { step } = useSupplySheetContext();

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
  const { step, failure, close, back } = useSupplySheetContext();

  return (
    <Sheet
      open={open}
      onOpenChange={close}
      title="Поставка материала"
      step={stepLabel(step)}
      hint={
        <Typography variant="label" className="text-muted-foreground m-0">
          ↑↓ Выбрать · Enter
        </Typography>
      }
      error={failure}
      actions={<SupplySheetActions />}
      back={
        step.kind === SupplyStepKind.Details ? (
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
    <SupplySheetProvider onOpenChange={onOpenChange}>
      <SupplySheetContent open={open} />
    </SupplySheetProvider>
  );
}
