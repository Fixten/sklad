import { useFormContext, useWatch } from "react-hook-form";

import useSupplier from "@/features/Supplier/useSupplier";
import { unitCostPreview } from "@/features/Supply/supplyFormRules";
import { UnitShortLabels } from "@/features/units";
import { FormInputField } from "@ui/InputField";
import { FieldGroup } from "@ui/InputFieldGroup";
import { FormOptionPicker } from "@ui/OptionPicker";
import type { OptionPickerOption } from "@ui/OptionPicker/OptionPicker";

import type { SupplyDraft, SupplyFormValues } from "../supplyForm";

import Calculations from "./Calculations";

export default function DetailsFields() {
  const { control } = useFormContext<SupplyFormValues, unknown, SupplyDraft>();
  const { suppliers, query } = useSupplier();
  const quantity = useWatch({ control, name: "quantity" });
  const price = useWatch({ control, name: "price" });
  const unit = useWatch({ control, name: "unit" });

  const options: OptionPickerOption[] = suppliers.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const unitCost = unit
    ? unitCostPreview({ quantity, price }, unit)
    : undefined;
  const quantityLimits =
    unit === "pieces"
      ? { min: "1", step: "1" }
      : { min: "0.001", step: "0.001" };

  return (
    <FieldGroup className="gap-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInputField
          control={control}
          name="quantity"
          label="Количество"
          type="number"
          inputMode="decimal"
          min={quantityLimits.min}
          step={quantityLimits.step}
          unit={unit ? UnitShortLabels[unit] : undefined}
        />
        <FormInputField
          control={control}
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

      <FormOptionPicker
        control={control}
        name="supplierName"
        label="Поставщик"
        options={options}
        loading={query.isLoading}
        canCreate
        onSelect={() => undefined}
      />
      <FormInputField control={control} name="description" label="Описание" />
      <FormInputField
        control={control}
        name="url"
        label="Ссылка"
        placeholder="https://…"
      />
    </FieldGroup>
  );
}
