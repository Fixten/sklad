import zod from "zod";

import { decimalPlaces } from "@/features/Supply/supplyFormRules";
import { UnitSchema, type Unit } from "@/features/units";
import { parseAmount } from "@/lib/amount";

export interface SupplyFormValues {
  typeQuery: string;
  typeId: number | null;
  typeName: string;
  materialQuery: string;
  materialId: number | null;
  materialName: string;
  variantQuery: string;
  variantId: number | null;
  variantName: string;
  unit: Unit | null;
  quantity: string;
  price: string;
  supplierName: string;
  description: string;
  url: string;
}

export type TargetDraft =
  | { kind: "existing"; variantId: number }
  | {
      kind: "new";
      typeId: number | undefined;
      typeName: string | undefined;
      materialId: number | undefined;
      materialName: string | undefined;
      variantName: string;
      unit: Unit;
    };

export interface SupplyDraft {
  target: TargetDraft;
  quantity: number;
  purchasePrice: number;
  supplierName: string;
  description?: string;
  url?: string;
}

export const supplyFormDefaults = {
  typeQuery: "",
  typeId: null,
  typeName: "",
  materialQuery: "",
  materialId: null,
  materialName: "",
  variantQuery: "",
  variantId: null,
  variantName: "",
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

const isCommitted = (id: number | null, name: string) =>
  id !== null || name.trim().length > 0;

export const createSupplyFormSchema = () =>
  zod
    .object({
      typeQuery: zod.string(),
      typeId: zod.number().int().nullable(),
      typeName: zod.string().trim(),
      materialQuery: zod.string(),
      materialId: zod.number().int().nullable(),
      materialName: zod.string().trim(),
      variantQuery: zod.string(),
      variantId: zod.number().int().nullable(),
      variantName: zod.string().trim(),
      unit: UnitSchema.nullable(),
      quantity: zod
        .string()
        .refine((value) => amount(value) > 0, "Укажите количество"),
      price: zod.string().refine((value) => {
        const parsed = parseAmount(value);

        return parsed !== null && parsed >= 0;
      }, "Укажите цену закупки"),
      supplierName: zod.string().trim().min(1, "Укажите поставщика"),
      description: zod.string().trim(),
      url: zod.string().trim(),
    })
    .superRefine((values, context) => {
      if (!isCommitted(values.typeId, values.typeName)) {
        context.addIssue({
          code: "custom",
          path: ["typeName"],
          message: "Выберите или создайте тип",
        });
      }
      if (!isCommitted(values.materialId, values.materialName)) {
        context.addIssue({
          code: "custom",
          path: ["materialName"],
          message: "Выберите или создайте материал",
        });
      }
      if (!isCommitted(values.variantId, values.variantName)) {
        context.addIssue({
          code: "custom",
          path: ["variantName"],
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
      target:
        values.variantId !== null
          ? { kind: "existing", variantId: values.variantId }
          : {
              kind: "new",
              typeId: values.typeId ?? undefined,
              typeName: values.typeName || undefined,
              materialId: values.materialId ?? undefined,
              materialName: values.materialName || undefined,
              variantName: values.variantName,
              unit: draftUnit(values.unit),
            },
      quantity: amount(values.quantity),
      purchasePrice: parseAmount(values.price) ?? 0,
      supplierName: values.supplierName,
      description: values.description || undefined,
      url: values.url || undefined,
    }));
