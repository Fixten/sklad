import type { MaterialModel } from "@/features/Material/Material.model";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import { UnitShortLabels } from "@/features/units";
import type { VariantModel } from "@/features/Variant/Variant.model";
import { formatLocalDate } from "@/lib/date";
import Typography from "@ui/Typography";

interface Props {
  variant: VariantModel;
  material?: MaterialModel;
  type?: MaterialTypeModel;
  stock: number;
  lastSupply?: string;
}

export default function VariantCardContent(props: Props) {
  const context = [props.material?.name, props.type?.name]
    .filter(Boolean)
    .join(" · ");
  const stock = Math.round(props.stock * 1000) / 1000;

  return (
    <>
      {context ? <Typography variant="caption">{context}</Typography> : null}
      <Typography variant="caption">
        Остаток: {stock} {UnitShortLabels[props.variant.unit]}
      </Typography>
      {props.lastSupply ? (
        <Typography variant="caption">
          {`Последняя поставка: ${formatLocalDate(props.lastSupply)}`}
        </Typography>
      ) : null}
    </>
  );
}
