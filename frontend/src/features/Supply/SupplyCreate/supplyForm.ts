import zod from "zod";

import { decimalPlaces } from "@/features/Supply/supplyFormRules";
import { UnitSchema, type Unit } from "@/features/units";
import { parseAmount } from "@/lib/amount";

export interface SupplyFormValues {
  type: string;
  material: string;
  variant: string;
  unit: Unit | null;
  quantity: string;
  price: string;
  supplierName: string;
  description: string;
  url: string;
}

export interface TargetDraft {
  typeName: string;
  materialName: string;
  variantName: string;
  unit: Unit;
}

export interface SupplyDraft {
  target: TargetDraft;
  quantity: number;
  purchasePrice: number;
  supplierName: string;
  description?: string;
  url?: string;
}

export const supplyFormDefaults = {
  type: "",
  material: "",
  variant: "",
  unit: null,
  quantity: "",
  price: "",
  supplierName: "",
  description: "",
  url: "",
} satisfies SupplyFormValues;

const amount = (raw: string) => parseAmount(raw) ?? 0;

const draftUnit = (unit: Unit | null): Unit => {
  if (unit === null) {
    throw new Error("unit is validated to exist");
  }

  return unit;
};

export const createSupplyFormSchema = () =>
  zod
    .object({
      type: zod.string(),
      material: zod.string(),
      variant: zod.string(),
      unit: UnitSchema.nullable(),
      quantity: zod
        .string()
        .refine((value) => amount(value) > 0, "Укажите количество"),
      price: zod.string().refine((value) => {
        const parsed = parseAmount(value);

        return parsed !== null && parsed >= 0;
      }, "Укажите цену закупки"),
      supplierName: zod.string().trim(),
      description: zod.string().trim(),
      url: zod.string().trim(),
    })
    .superRefine((values, context) => {
      if (values.type.trim() === "") {
        context.addIssue({
          code: "custom",
          path: ["type"],
          message: "Выберите или создайте тип",
        });
      }
      if (values.material.trim() === "") {
        context.addIssue({
          code: "custom",
          path: ["material"],
          message: "Выберите или создайте материал",
        });
      }
      if (values.variant.trim() === "") {
        context.addIssue({
          code: "custom",
          path: ["variant"],
          message: "Выберите или создайте вариант",
        });
      }
      if (values.unit === null) {
        context.addIssue({
          code: "custom",
          path: ["unit"],
          message: "Выберите единицу",
        });
      }

      if (
        values.unit === "pieces" &&
        !Number.isInteger(amount(values.quantity))
      ) {
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Количество в штуках должно быть целым",
        });
      } else if (
        values.unit === "meters" &&
        decimalPlaces(amount(values.quantity)) > 3
      ) {
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Не больше трёх знаков после запятой",
        });
      }
    })
    .transform((values): SupplyDraft => ({
      target: {
        typeName: values.type,
        materialName: values.material,
        variantName: values.variant,
        unit: draftUnit(values.unit),
      },
      quantity: amount(values.quantity),
      purchasePrice: parseAmount(values.price) ?? 0,
      supplierName: values.supplierName,
      description: values.description || undefined,
      url: values.url || undefined,
    }));
