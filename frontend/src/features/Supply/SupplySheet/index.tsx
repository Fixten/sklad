import { Button } from "@ui/Button";
import Sheet from "@ui/Sheet";
import Typography from "@ui/Typography";

import { stepLabel, SupplyStepKind } from "./flow";
import SupplySheetActions from "./SupplySheetActions";
import SupplySheetBody from "./SupplySheetBody";
import { useSupplySheet } from "./useSupplySheet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SupplySheet({ open, onOpenChange }: Props) {
  const sheet = useSupplySheet({ onOpenChange });

  return (
    <Sheet
      open={open}
      onOpenChange={sheet.handleOpenChange}
      title="Поставка материала"
      step={stepLabel(sheet.step)}
      hint={
        <Typography variant="label" className="text-muted-foreground m-0">
          ↑↓ Выбрать · Enter
        </Typography>
      }
      error={sheet.failure}
      actions={
        <SupplySheetActions
          step={sheet.step}
          onCancel={() => {
            sheet.handleOpenChange(false);
          }}
          onBack={sheet.back}
          onSubmit={() => {
            if (sheet.step.kind === SupplyStepKind.Details) {
              void sheet.submitDetails(sheet.step.row);
            }
          }}
        />
      }
      back={
        sheet.step.kind === SupplyStepKind.Details ? (
          <Button variant="ghost" onClick={sheet.back}>
            Назад
          </Button>
        ) : undefined
      }
    >
      <SupplySheetBody
        step={sheet.step}
        query={sheet.query}
        matchedRows={sheet.matchedRows}
        creation={sheet.creation}
        details={sheet.details}
        detailsErrors={sheet.detailsErrors}
        supplierOptions={sheet.supplierOptions}
        unitCost={sheet.unitCost}
        types={sheet.types}
        variantPending={sheet.variantPending}
        materialPending={sheet.materialPending}
        onQueryChange={sheet.setQuery}
        onSelectVariant={sheet.selectVariant}
        onSelectCreation={sheet.selectCreation}
        onCreateVariant={sheet.createVariant}
        onCreateMaterial={sheet.createMaterial}
        onUpdateDetails={sheet.updateDetails}
        onClearDetailsError={sheet.clearDetailsError}
      />
    </Sheet>
  );
}
