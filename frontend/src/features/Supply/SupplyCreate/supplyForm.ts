import zod from "zod";

import { decimalPlaces } from "@/features/Supply/supplyFormRules";
import { UnitSchema, type Unit } from "@/features/units";
import { parseAmount } from "@/lib/amount";

export interface SupplyFormValues {
  variantId: number | null;
  typeId: number | null;
  typeName: string;
  materialId: number | null;
  materialName: string;
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
      materialName: string;
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
  variantId: null,
  typeId: null,
  typeName: "",
  materialId: null,
  materialName: "",
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

export const createSupplyFormSchema = () =>
  zod
    .object({
      variantId: zod.number().int().nullable(),
      typeId: zod.number().int().nullable(),
      typeName: zod.string().trim(),
      materialId: zod.number().int().nullable(),
      materialName: zod.string().trim(),
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
      if (values.variantId !== null) {
        if (values.unit === null) {
          context.addIssue({
            code: "custom",
            path: ["unit"],
            message: "Выберите материал",
          });
        }
      } else {
        const chainEmpty =
          !values.typeName.trim() &&
          !values.materialName.trim() &&
          !values.variantName.trim() &&
          values.unit === null;

        if (chainEmpty) {
          context.addIssue({
            code: "custom",
            path: ["variantId"],
            message: "Выберите материал",
          });
        } else {
          const missingType = values.typeId === null && !values.typeName.trim();
          const missingMaterial =
            values.materialId === null && !values.materialName.trim();
          const missingVariantName = !values.variantName.trim();
          const missingUnit = values.unit === null;

          if (
            missingType ||
            missingMaterial ||
            missingVariantName ||
            missingUnit
          ) {
            context.addIssue({
              code: "custom",
              path: ["variantId"],
              message: "Выберите материал",
            });
          }
          if (missingType) {
            context.addIssue({
              code: "custom",
              path: ["typeName"],
              message: "Укажите тип",
            });
          }
          if (missingMaterial) {
            context.addIssue({
              code: "custom",
              path: ["materialName"],
              message: "Укажите материал",
            });
          }
          if (missingVariantName) {
            context.addIssue({
              code: "custom",
              path: ["variantName"],
              message: "Укажите вариант",
            });
          }
          if (missingUnit) {
            context.addIssue({
              code: "custom",
              path: ["unit"],
              message: "Укажите единицу",
            });
          }
        }
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
              materialName: values.materialName,
              variantName: values.variantName,
              unit: draftUnit(values.unit),
            },
      quantity: amount(values.quantity),
      purchasePrice: parseAmount(values.price) ?? 0,
      supplierName: values.supplierName,
      description: values.description || undefined,
      url: values.url || undefined,
    }));
