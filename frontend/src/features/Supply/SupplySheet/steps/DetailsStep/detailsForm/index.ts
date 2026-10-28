import zod from "zod";

import { UnitShortLabels, type Unit } from "@/features/units";
import { formatAmount, parseAmount } from "@/lib/amount";

export interface SupplierValue {
  id: number | null;
  name: string;
}

export interface DetailsFormValues {
  quantity: string;
  price: string;
  supplier: SupplierValue;
  description: string;
  url: string;
}

export interface DetailsDraft {
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

export const detailsFormDefaults = {
  quantity: "",
  price: "",
  supplier: { id: null, name: "" },
  description: "",
  url: "",
} satisfies DetailsFormValues;

const amountField = (message: string) =>
  zod.string().transform((raw, context) => {
    const value = parseAmount(raw);

    if (value === null) {
      context.addIssue({ code: "custom", message });

      return zod.NEVER;
    }

    return value;
  });

const decimalPlaces = (value: number) => {
  const [coefficient = "", exponentText] = String(value)
    .toLowerCase()
    .split("e");
  const fractionLength = coefficient.split(".")[1]?.length ?? 0;
  const exponent = exponentText === undefined ? 0 : Number(exponentText);

  return Math.max(0, fractionLength - exponent);
};

const quantityField = (unit: Unit) =>
  amountField("Укажите количество")
    .refine((value) => value > 0, "Укажите количество")
    .refine(
      (value) =>
        unit === "pieces" ? Number.isInteger(value) : decimalPlaces(value) <= 3,
      unit === "pieces"
        ? "Количество в штуках должно быть целым"
        : "Не больше трёх знаков после запятой",
    );

export const createDetailsFormSchema = (unit: Unit) =>
  zod
    .object({
      quantity: quantityField(unit),
      price: amountField("Укажите цену закупки").refine(
        (value) => value >= 0,
        "Укажите цену закупки",
      ),
      supplier: zod
        .object({
          id: zod.number().int().nullable(),
          name: zod.string(),
        })
        .superRefine((supplier, context) => {
          if (!supplier.name.trim()) {
            context.addIssue({
              code: "custom",
              message: "Укажите поставщика",
            });
          }
        }),
      description: zod.string(),
      url: zod.string(),
    })
    .transform((values): DetailsDraft => ({
      quantity: values.quantity,
      purchasePrice: values.price,
      supplierName: values.supplier.name.trim(),
      supplierId: values.supplier.id,
      description: values.description.trim() || undefined,
      url: values.url.trim() || undefined,
    }));

export type DetailsFormSchema = ReturnType<typeof createDetailsFormSchema>;

export function unitCostPreview(
  values: Pick<DetailsFormValues, "quantity" | "price">,
  unit: Unit,
): UnitCostPreview | null {
  const quantity = parseAmount(values.quantity);
  const price = parseAmount(values.price);

  if (price === null || quantity === null || quantity <= 0) return null;

  return {
    value: price / quantity,
    formula: `${formatAmount(price)} ₽ ÷ ${formatAmount(quantity)} ${UnitShortLabels[unit]}`,
  };
}

export const formatUnitCost = (value: number, unit: Unit) =>
  `${formatAmount(value)} ₽ / ${UnitShortLabels[unit]}`;
