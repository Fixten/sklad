import zod from "zod";

import { amountField, decimalPlaces } from "@/features/Supply/supplyFormRules";
import { UnitSchema, type Unit } from "@/features/units";

export interface SupplyFormValues {
  variantId: number | null;
  unit: Unit | null;
  quantity: string;
  price: string;
  supplierName: string;
  description: string;
  url: string;
}

export interface SupplyDraft {
  variantId: number;
  unit: Unit;
  quantity: number;
  purchasePrice: number;
  supplierName: string;
  description?: string;
  url?: string;
}

export const supplyFormDefaults = {
  variantId: null,
  unit: null,
  quantity: "",
  price: "",
  supplierName: "",
  description: "",
  url: "",
} satisfies SupplyFormValues;

const selectedVariant = zod
  .number()
  .int()
  .nullable()
  .refine((value): value is number => value !== null, {
    message: "Выберите материал",
  });

const selectedUnit = UnitSchema.nullable().refine(
  (value): value is Unit => value !== null,
  { message: "Выберите материал" },
);

export const createSupplyFormSchema = () =>
  zod
    .object({
      variantId: selectedVariant,
      unit: selectedUnit,
      quantity: amountField("Укажите количество").refine(
        (value) => value > 0,
        "Укажите количество",
      ),
      price: amountField("Укажите цену закупки").refine(
        (value) => value >= 0,
        "Укажите цену закупки",
      ),
      supplierName: zod.string().trim().min(1, "Укажите поставщика"),
      description: zod.string().trim(),
      url: zod.string().trim(),
    })
    .superRefine((values, context) => {
      if (values.unit === "pieces" && !Number.isInteger(values.quantity)) {
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Количество в штуках должно быть целым",
        });
      } else if (
        values.unit === "meters" &&
        decimalPlaces(values.quantity) > 3
      ) {
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Не больше трёх знаков после запятой",
        });
      }
    })
    .transform((values): SupplyDraft => ({
      variantId: values.variantId,
      unit: values.unit,
      quantity: values.quantity,
      purchasePrice: values.price,
      supplierName: values.supplierName,
      description: values.description || undefined,
      url: values.url || undefined,
    }));
