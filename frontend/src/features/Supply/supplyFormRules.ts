import zod from "zod";

import { UnitShortLabels, type Unit } from "@/features/units";
import { formatAmount, parseAmount } from "@/lib/amount";

export interface UnitCostValues {
  quantity: string;
  price: string;
}

export interface UnitCostPreview {
  value: number;
  formula: string;
}

export const amountField = (message: string) =>
  zod.string().transform((raw, context) => {
    const value = parseAmount(raw);

    if (value === null) {
      context.addIssue({ code: "custom", message });

      return zod.NEVER;
    }

    return value;
  });

export const decimalPlaces = (value: number) => {
  const [coefficient = "", exponentText] = String(value)
    .toLowerCase()
    .split("e");
  const fractionLength = coefficient.split(".")[1]?.length ?? 0;
  const exponent = exponentText === undefined ? 0 : Number(exponentText);

  return Math.max(0, fractionLength - exponent);
};

export const quantityField = (unit: Unit) =>
  amountField("Укажите количество")
    .refine((value) => value > 0, "Укажите количество")
    .refine(
      (value) =>
        unit === "pieces" ? Number.isInteger(value) : decimalPlaces(value) <= 3,
      unit === "pieces"
        ? "Количество в штуках должно быть целым"
        : "Не больше трёх знаков после запятой",
    );

export function unitCostPreview(
  values: UnitCostValues,
  unit: Unit,
): UnitCostPreview | undefined {
  const quantity = parseAmount(values.quantity);
  const price = parseAmount(values.price);

  if (price === null || quantity === null || quantity <= 0) return undefined;

  return {
    value: price / quantity,
    formula: `${formatAmount(price)} ₽ ÷ ${formatAmount(quantity)} ${UnitShortLabels[unit]}`,
  };
}

export const formatUnitCost = (value: number, unit: Unit) =>
  `${formatAmount(value)} ₽ / ${UnitShortLabels[unit]}`;
