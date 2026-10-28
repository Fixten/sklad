import { UnitHints } from "@/features/units";
import { Form, FormField } from "@ui/Form";
import { FormInputField } from "@ui/InputField";
import Typography from "@ui/Typography";

import { supplyDetailsFormId } from "../../supplySteps";

import { formatUnitCost } from "./detailsForm";
import SupplierPicker from "./SupplierPicker";
import { useDetailsForm } from "./useDetailsForm";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

interface Props {
  row: MaterialCatalogRow;
}

export default function DetailsStep({ row }: Props) {
  const { form, busy, suppliers, unitCost, submit } = useDetailsForm(row);

  return (
    <Form
      id={supplyDetailsFormId}
      form={form}
      onSubmit={submit}
      aria-busy={busy || undefined}
      className="flex flex-col gap-6"
    >
      <div className="bg-card flex flex-col gap-1 px-4 py-3">
        <Typography variant="label" className="text-muted-foreground">
          Материал
        </Typography>
        <Typography variant="body">
          {`${row.material.name} · ${row.variantName}`}
        </Typography>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormInputField
          control={form.control}
          name="quantity"
          label="Количество"
          type="number"
          min={row.unit === "pieces" ? "1" : "0.001"}
          step={row.unit === "pieces" ? "1" : "0.001"}
          hint={UnitHints[row.unit]}
        />
        <FormInputField
          control={form.control}
          name="price"
          label="Цена закупки, всего"
          type="number"
          min="0"
          step="any"
          hint="₽ за партию"
        />
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="supplier"
            render={({ field, fieldState }) => (
              <SupplierPicker
                suppliers={suppliers}
                value={field.value}
                name={field.name}
                inputRef={field.ref}
                error={fieldState.error?.message}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
        <FormInputField
          control={form.control}
          name="description"
          label="Описание"
          placeholder="Например: осенняя партия, сорт А"
          className="col-span-2"
        />
        <FormInputField
          control={form.control}
          name="url"
          label="Ссылка"
          placeholder="https://…"
          className="col-span-2"
        />
        <div className="col-span-2">
          <div className="flex items-start justify-between gap-6 py-3">
            <Typography variant="label" className="text-muted-foreground">
              Цена за единицу
            </Typography>
            <div className="flex flex-col items-end gap-1 text-right">
              <Typography variant="data">
                {unitCost ? formatUnitCost(unitCost.value, row.unit) : "—"}
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                {unitCost
                  ? unitCost.formula
                  : "Появится после ввода количества и цены."}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
