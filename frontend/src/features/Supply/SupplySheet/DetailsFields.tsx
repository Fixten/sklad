import { UnitHints } from "@/features/units";
import { InputField } from "@ui/InputField";
import { Separator } from "@ui/Separator";
import Typography from "@ui/Typography";

import SupplierPicker, { type SupplierOption } from "../SupplierPicker";

import { formatUnitCost } from "./detailsForm";

import type {
  DetailsErrors,
  DetailsForm,
  UnitCostPreview,
} from "./detailsForm";
import type { MaterialCatalogRow } from "../../Material/useMaterialsCatalog";

interface Props {
  row: MaterialCatalogRow;
  details: DetailsForm;
  errors: DetailsErrors;
  suppliers: SupplierOption[];
  unitCost: UnitCostPreview | null;
  onChange: (patch: Partial<DetailsForm>) => void;
  onClearError: (key: keyof DetailsErrors) => void;
}

export default function DetailsFields({
  row,
  details,
  errors,
  suppliers,
  unitCost,
  onChange,
  onClearError,
}: Props) {
  return (
    <>
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
            onChange({ quantity: event.target.value });
            onClearError("quantity");
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
            onChange({ price: event.target.value });
            onClearError("price");
          }}
        />
        <div className="col-span-2">
          <SupplierPicker
            suppliers={suppliers}
            value={{ id: details.supplierId, name: details.supplierName }}
            error={errors.supplier}
            onChange={(value) => {
              onChange({ supplierId: value.id, supplierName: value.name });
              onClearError("supplier");
            }}
          />
        </div>
        <InputField
          className="col-span-2"
          label="Описание"
          placeholder="Например: осенняя партия, сорт А"
          value={details.description}
          onChange={(event) => {
            onChange({ description: event.target.value });
          }}
        />
        <InputField
          className="col-span-2"
          label="Ссылка"
          placeholder="https://…"
          value={details.url}
          onChange={(event) => {
            onChange({ url: event.target.value });
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
          <Separator />
        </div>
      </div>
    </>
  );
}
