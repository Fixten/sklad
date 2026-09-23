import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

import { MATERIAL_VARIANT_UNITS } from "./materialVariant.schema.js";

export const materialVariantRowZ = z
  .object({
    id: z.int(),
    name: z.string(),
    unit: z.enum(MATERIAL_VARIANT_UNITS),
    material_id: z.int(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const materialVariantCreateZ = z
  .object({
    name: z.string().trim().min(1),
    unit: z.enum(MATERIAL_VARIANT_UNITS),
    material_id: z.int(),
  })
  .strict();

export const materialVariantPatchZ = materialVariantCreateZ.partial();

export const materialVariantRowListZ = z.array(materialVariantRowZ);

export type MaterialVariantRow = z.infer<typeof materialVariantRowZ>;
export type MaterialVariantCreate = z.infer<typeof materialVariantCreateZ>;
export type MaterialVariantPatch = z.infer<typeof materialVariantPatchZ>;