import { useNavigate } from "react-router";

import { isFeatureEnabled } from "@/config/features";
import type { MaterialModel } from "@/features/Material/Material.model";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import { UnitShortLabels } from "@/features/units";
import type { VariantModel } from "@/features/Variant/Variant.model";
import { formatLocalDate } from "@/lib/date";
import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

import HiddenMessage from "../../../../HiddenMessage";

interface Props {
  variant: VariantModel;
  material?: MaterialModel;
  type?: MaterialTypeModel;
  stock: number;
  lastSupply?: string;
  supplyTo: string;
  hidden?: boolean;
}

export default function VariantCardContent(props: Props) {
  const navigate = useNavigate();
  const context = [props.material?.name, props.type?.name]
    .filter(Boolean)
    .join(" · ");
  const stock = Math.round(props.stock * 1000) / 1000;

  return (
    <>
      {props.hidden ? <HiddenMessage /> : null}
      {context ? <Typography variant="caption">{context}</Typography> : null}
      <Typography variant="caption">
        Остаток: {stock} {UnitShortLabels[props.variant.unit]}
      </Typography>
      {props.lastSupply ? (
        <Typography variant="caption">
          {`Последняя поставка: ${formatLocalDate(props.lastSupply)}`}
        </Typography>
      ) : null}
      {isFeatureEnabled("supply") && !props.hidden ? (
        <Button
          onClick={() => {
            void navigate(props.supplyTo);
          }}
        >
          Сделать поставку
        </Button>
      ) : null}
    </>
  );
}
