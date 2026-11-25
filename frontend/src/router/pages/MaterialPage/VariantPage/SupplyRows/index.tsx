import type { SupplyModel } from "@/features/Supply/Supply.model";
import { UnitShortLabels } from "@/features/units";
import { formatLocalDate } from "@/lib/date";
import Typography from "@ui/Typography";

interface Props {
  supplies: SupplyModel[];
}

export default function SupplyRows(props: Props) {
  return (
    <div className="flex flex-col gap-2">
      {props.supplies.map((supply) => (
        <Typography key={supply.id} variant="caption">
          {formatLocalDate(supply.created_at)} · {supply.quantity}{" "}
          {UnitShortLabels[supply.unit]} · Остаток: {supply.remaining_quantity}{" "}
          {UnitShortLabels[supply.unit]}
        </Typography>
      ))}
    </div>
  );
}
