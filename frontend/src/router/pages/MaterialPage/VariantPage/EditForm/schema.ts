import zod from "zod";

import { UnitSchema } from "@/features/units";

export const variantEditSchema = zod
  .object({
    name: zod.string().trim().min(1, "Укажите название"),
    unit: UnitSchema,
    materialId: zod.string().min(1, "Выберите материал"),
  })
  .transform((values) => ({
    name: values.name,
    unit: values.unit,
    material_id: Number(values.materialId),
  }));

export type VariantEditValues = zod.input<typeof variantEditSchema>;
export type VariantEditDraft = zod.output<typeof variantEditSchema>;
