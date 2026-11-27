import type { SupplyModel } from "@/features/Supply/Supply.model";
import { formatUnitCost } from "@/features/Supply/supplyFormRules";
import { UnitShortLabels } from "@/features/units";
import { formatLocalDate } from "@/lib/date";
import CatalogCard from "@/router/pages/MaterialPage/Catalog/CardList/CatalogCard";
import Typography from "@ui/Typography";

import type { SupplyContext } from "../useSuppliesView";

interface Props {
  supply: SupplyModel;
  context: SupplyContext;
}

export default function SupplyCard(props: Props) {
  const contextNames = [
    props.context.type?.name,
    props.context.material?.name,
    props.context.variant?.name,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <CatalogCard
      title={props.context.variant?.name ?? "Поставка"}
      description={props.supply.description ?? ""}
      content={
        <>
          {contextNames ? (
            <Typography variant="caption">{contextNames}</Typography>
          ) : null}
          <Typography variant="caption">
            {`Количество: ${String(props.supply.quantity)} ${UnitShortLabels[props.context.unit]} · Остаток: ${String(props.supply.remaining_quantity)} ${UnitShortLabels[props.context.unit]}`}
          </Typography>
          <Typography variant="caption">
            {`Цена за единицу: ${formatUnitCost(props.supply.unit_purchase_cost, props.context.unit)}`}
          </Typography>
          {props.context.supplier ? (
            <Typography variant="caption">
              {`Поставщик: ${props.context.supplier.name}`}
            </Typography>
          ) : null}
          {props.supply.url ? (
            <Typography
              variant="caption"
              tagName="a"
              href={props.supply.url}
              target="_blank"
              rel="noreferrer"
              className="text-foreground decoration-primary hover:text-primary underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Ссылка
            </Typography>
          ) : null}
          <Typography variant="caption">
            {`Дата: ${formatLocalDate(props.supply.created_at)}`}
          </Typography>
        </>
      }
    />
  );
}
