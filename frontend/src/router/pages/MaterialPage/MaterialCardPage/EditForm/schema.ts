import zod from "zod";

export const materialEditSchema = zod
  .object({
    name: zod.string().trim().min(1, "Укажите название"),
    description: zod.string().trim(),
    typeId: zod.string().min(1, "Выберите тип"),
  })
  .transform((values) => ({
    name: values.name,
    description: values.description || null,
    material_type_id: Number(values.typeId),
  }));

export type MaterialEditValues = zod.input<typeof materialEditSchema>;
export type MaterialEditDraft = zod.output<typeof materialEditSchema>;
