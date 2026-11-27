import { z } from "zod";

import { dateZ, listQueryZ } from "@/openapi/common.zod.js";

const decimalZ = z.union([z.number(), z.string()]);
const nullableDecimalZ = z
  .union([decimalZ, z.null()])
  .optional()
  .openapi({
    anyOf: [
      { type: "number" },
      { type: "string" },
      { type: "string", nullable: true, enum: [null] },
    ],
  });

export const productTemplateMaterialZ = z
  .object({
    material_variant_id: z.int(),
    quantity: z.number(),
  })
  .strict();

export const productTemplateRowZ = z
  .object({
    id: z.int(),
    name: z.string(),
    description: z.string().nullish(),
    production_instructions: z.string().nullish(),
    drawing_description: z.string().nullish(),
    expected_production_work_hours: z.number().nullish(),
    development_work_hours: z.number().nullish(),
    materials: z.array(productTemplateMaterialZ),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const productTemplateDetailZ = productTemplateRowZ;

export const productTemplateCreateZ = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().nullish(),
    production_instructions: z.string().nullish(),
    drawing_description: z.string().nullish(),
    expected_production_work_hours: nullableDecimalZ,
    development_work_hours: nullableDecimalZ,
    materials: z
      .array(
        z
          .object({
            material_variant_id: z.int(),
            quantity: decimalZ,
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export const productTemplatePatchZ = productTemplateCreateZ.partial();

export const productTemplateListQueryZ = listQueryZ;

export const productTemplateRowListZ = z.array(productTemplateRowZ);

export type ProductTemplateMaterial = z.infer<typeof productTemplateMaterialZ>;
export type ProductTemplateRow = z.infer<typeof productTemplateRowZ>;
export type ProductTemplateDetail = z.infer<typeof productTemplateDetailZ>;
export type ProductTemplateCreate = z.infer<typeof productTemplateCreateZ>;
export type ProductTemplatePatch = z.infer<typeof productTemplatePatchZ>;
export type ProductTemplateListQuery = z.infer<
  typeof productTemplateListQueryZ
>;
