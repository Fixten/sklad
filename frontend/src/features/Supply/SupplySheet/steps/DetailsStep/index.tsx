import { UnitHints } from "@/features/units";
import { InputField } from "@ui/InputField";
import Typography from "@ui/Typography";

import { formatUnitCost } from "./detailsForm";
import SupplierPicker from "./SupplierPicker";
import { useDetailsStep } from "./useDetailsStep";

import type { DetailsForm, DetailsErrors } from "./detailsForm";
import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

interface Props {
  row: MaterialCatalogRow;
}

export default function DetailsStep({ row }: Props) {
  const { details, errors, suppliers, unitCost, update, clearError } =
    useDetailsStep(row);

  const change = (patch: Partial<DetailsForm>, key?: keyof DetailsErrors) => {
    update(patch);
    if (key) clearError(key);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card flex flex-col gap-1 px-4 py-3">
        <Typography variant="label" className="text-muted-foreground">
          Материал
        </Typography>
        <Typography variant="body">
          {`${row.material.name} · ${row.variantName}`}
        </Typography>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Количество"
          type="number"
          min="0"
          step="any"
          value={details.quantity}
          error={errors.quantity}
          hint={UnitHints[row.unit]}
          onChange={(event) => {
            change({ quantity: event.target.value }, "quantity");
          }}
        />
        <InputField
          label="Цена закупки, всего"
          type="number"
          min="0"
          step="any"
          value={details.price}
          error={errors.price}
          hint="₽ за партию"
          onChange={(event) => {
            change({ price: event.target.value }, "price");
          }}
        />
        <div className="col-span-2">
          <SupplierPicker
            suppliers={suppliers}
            value={{ id: details.supplierId, name: details.supplierName }}
            error={errors.supplier}
            onChange={(value) => {
              change(
                { supplierId: value.id, supplierName: value.name },
                "supplier",
              );
            }}
          />
        </div>
        <InputField
          className="col-span-2"
          label="Описание"
          placeholder="Например: осенняя партия, сорт А"
          value={details.description}
          onChange={(event) => {
            change({ description: event.target.value });
          }}
        />
        <InputField
          className="col-span-2"
          label="Ссылка"
          placeholder="https://…"
          value={details.url}
          onChange={(event) => {
            change({ url: event.target.value });
          }}
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
    </div>
  );
}
