import { UnitShortLabels, type Unit } from "@/features/units";
import { formatAmount, parseAmount } from "@/lib/amount";

export interface DetailsForm {
  quantity: string;
  price: string;
  supplierId: number | null;
  supplierName: string;
  description: string;
  url: string;
}

export type DetailsErrors = Partial<
  Record<"quantity" | "price" | "supplier", string>
>;

export interface DetailsPayload {
  quantity: number;
  purchasePrice: number;
  supplierName: string;
  supplierId: number | null;
  description?: string;
  url?: string;
}

export interface UnitCostPreview {
  value: number;
  formula: string;
}

export const emptyDetails = (): DetailsForm => ({
  quantity: "",
  price: "",
  supplierId: null,
  supplierName: "",
  description: "",
  url: "",
});

export function parseDetails(form: DetailsForm): {
  errors: DetailsErrors;
  payload: DetailsPayload | null;
} {
  const errors: DetailsErrors = {};
  const quantity = parseAmount(form.quantity);
  const price = parseAmount(form.price);
  const supplierName = form.supplierName.trim();

  if (quantity === null || quantity <= 0) {
    errors.quantity = "Укажите количество";
  }

  if (price === null || price < 0) {
    errors.price = "Укажите цену закупки";
  }

  if (form.supplierId === null && !supplierName) {
    errors.supplier = "Укажите поставщика";
  }

  if (Object.keys(errors).length > 0 || quantity === null || price === null) {
    return { errors, payload: null };
  }

  return {
    errors,
    payload: {
      quantity,
      purchasePrice: price,
      supplierName,
      supplierId: form.supplierId,
      description: form.description.trim() || undefined,
      url: form.url.trim() || undefined,
    },
  };
}

export function unitCostPreview(
  form: DetailsForm,
  unit: Unit,
): UnitCostPreview | null {
  const quantity = parseAmount(form.quantity);
  const price = parseAmount(form.price);

  if (price === null || quantity === null || quantity <= 0) return null;

  return {
    value: price / quantity,
    formula: `${formatAmount(price)} ₽ ÷ ${formatAmount(quantity)} ${UnitShortLabels[unit]}`,
  };
}

export const formatUnitCost = (value: number, unit: Unit) =>
  `${formatAmount(value)} ₽ / ${UnitShortLabels[unit]}`;
