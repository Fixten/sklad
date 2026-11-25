import zod from "zod";

export const typeEditSchema = zod
  .object({
    name: zod.string().trim().min(1, "Укажите название"),
    description: zod.string().trim(),
  })
  .transform((values) => ({
    name: values.name,
    description: values.description || null,
  }));

export type TypeEditValues = zod.input<typeof typeEditSchema>;
export type TypeEditDraft = zod.output<typeof typeEditSchema>;
