import {
  formatUnitCost,
  type UnitCostPreview,
} from "@/features/Supply/supplyFormRules";
import { UnitShortLabels, type Unit } from "@/features/units";
import { FieldGroup, FormInputField } from "@ui/InputField";
import Typography from "@ui/Typography";

import type { SupplyDraft, SupplyFormValues } from "../supplyForm";
import type { Control } from "react-hook-form";

interface Props {
  control: Control<SupplyFormValues, unknown, SupplyDraft>;
  unit?: Unit;
  unitCost?: UnitCostPreview;
}

const Calculations = ({
  unitCost,
  unit,
}: Required<Pick<Props, "unitCost" | "unit">>) => (
  <div className="flex items-start justify-between gap-6">
    <Typography variant="label" className="text-muted-foreground">
      Цена за единицу
    </Typography>
    <div className="flex flex-col items-end gap-1 text-right">
      <Typography variant="data">
        {formatUnitCost(unitCost.value, unit)}
      </Typography>
      <Typography variant="caption" className="text-muted-foreground">
        {unitCost.formula}
      </Typography>
    </div>
  </div>
);

export default function DetailsFields(props: Props) {
  const { unit, unitCost } = props;
  const quantityLimits =
    props.unit === "pieces"
      ? { min: "1", step: "1" }
      : { min: "0.001", step: "0.001" };

  return (
    <FieldGroup className="gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInputField
          control={props.control}
          name="quantity"
          label="Количество"
          type="number"
          inputMode="decimal"
          min={quantityLimits.min}
          step={quantityLimits.step}
          unit={props.unit ? UnitShortLabels[props.unit] : undefined}
        />
        <FormInputField
          control={props.control}
          name="price"
          label="Цена закупки, всего"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          unit="₽"
        />
      </div>

      {unit && unitCost ? (
        <Calculations unit={unit} unitCost={unitCost} />
      ) : null}

      <FormInputField
        control={props.control}
        name="supplierName"
        label="Поставщик"
      />
      <FormInputField
        control={props.control}
        name="description"
        label="Описание"
      />
      <FormInputField
        control={props.control}
        name="url"
        label="Ссылка"
        placeholder="https://…"
      />
    </FieldGroup>
  );
}
