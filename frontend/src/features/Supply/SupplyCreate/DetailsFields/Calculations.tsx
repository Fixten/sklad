import Typography from "@/components/ui/Typography";
import { Unit } from "@/features/units";

import { formatUnitCost, UnitCostPreview } from "../../supplyFormRules";

interface Props {
  unitCost: UnitCostPreview;
  unit: Unit;
}

export default function Calculations(props: Props) {
  return (
    <div className="flex items-start justify-between gap-6">
      <Typography variant="label" className="text-muted-foreground">
        Цена за единицу
      </Typography>
      <div className="flex flex-col items-end gap-1 text-right">
        <Typography variant="data">
          {formatUnitCost(props.unitCost.value, props.unit)}
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          {props.unitCost.formula}
        </Typography>
      </div>
    </div>
  );
}
