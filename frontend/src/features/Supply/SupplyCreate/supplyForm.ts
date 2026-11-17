import zod from "zod";

import { decimalPlaces } from "@/features/Supply/supplyFormRules";
import { UnitSchema } from "@/features/units";
import { parseAmount } from "@/lib/amount";

const amount = (raw: string) => parseAmount(raw) ?? 0;

export const createSupplyFormSchema = () =>
  zod
    .object({
      typeId: zod.string(),
      materialId: zod.string(),
      variantId: zod.string().min(1, "Выберите или создайте вариант"),
      unit: zod.union([zod.literal(""), UnitSchema]),
      quantity: zod
        .string()
        .refine((value) => amount(value) > 0, "Укажите количество"),
      price: zod.string().refine((value) => {
        const parsed = parseAmount(value);

        return parsed !== null && parsed >= 0;
      }, "Укажите цену закупки"),
      supplierId: zod.string(),
      description: zod.string().trim(),
      url: zod.string().trim(),
    })
    .superRefine((values, context) => {
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
    .transform((values) => ({
      variantId: Number(values.variantId),
      quantity: amount(values.quantity),
      purchasePrice: parseAmount(values.price) ?? 0,
      supplierId:
        values.supplierId === "" ? undefined : Number(values.supplierId),
      description: values.description || undefined,
      url: values.url || undefined,
    }));

type SupplyFormSchema = ReturnType<typeof createSupplyFormSchema>;

export type SupplyFormValues = zod.input<SupplyFormSchema>;
export type SupplyDraft = zod.output<SupplyFormSchema>;

export const supplyFormDefaults: SupplyFormValues = {
  typeId: "",
  materialId: "",
  variantId: "",
  unit: "",
  quantity: "",
  price: "",
  supplierId: "",
  description: "",
  url: "",
};
