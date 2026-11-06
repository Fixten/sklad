import zod from "zod";

import { amountField, quantityField } from "@/features/Supply/supplyFormRules";
import type { Unit } from "@/features/units";

export {
  formatUnitCost,
  unitCostPreview,
} from "@/features/Supply/supplyFormRules";
export type { UnitCostPreview } from "@/features/Supply/supplyFormRules";

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

export const detailsFormDefaults = {
  quantity: "",
  price: "",
  supplier: { id: null, name: "" },
  description: "",
  url: "",
} satisfies DetailsFormValues;

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
