import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

export const materialRowZ = z
  .object({
    id: z.int(),
    name: z.string(),
    description: z.string().nullish(),
    material_type_id: z.int(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const materialCreateZ = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    material_type_id: z.int(),
  })
  .strict();

export const materialPatchZ = materialCreateZ.partial();

export const materialRowListZ = z.array(materialRowZ);

export type MaterialRow = z.infer<typeof materialRowZ>;
export type MaterialCreate = z.infer<typeof materialCreateZ>;
export type MaterialPatch = z.infer<typeof materialPatchZ>;