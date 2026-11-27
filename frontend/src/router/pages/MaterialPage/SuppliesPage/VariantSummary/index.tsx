import { UnitShortLabels } from "@/features/units";
import type { VariantModel } from "@/features/Variant/Variant.model";
import pathsRouter from "@/router/paths.router";
import Link from "@ui/Link";
import Typography from "@ui/Typography";

interface Props {
  variant: VariantModel;
  stock: number;
}

export default function VariantSummary(props: Props) {
  return (
    <>
      <Link to={pathsRouter.supplies}>Все поставки</Link>
      <Typography variant="caption">
        {`Остаток: ${String(Math.round(props.stock * 1000) / 1000)} ${UnitShortLabels[props.variant.unit]}`}
      </Typography>
    </>
  );
}
