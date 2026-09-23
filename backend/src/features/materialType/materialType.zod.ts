import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

export const materialTypeRowZ = z
  .object({
    id: z.int(),
    name: z.string(),
    description: z.string().nullish(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const materialTypeCreateZ = z
  .object({
    name: z.string(),
    description: z.string().optional(),
  })
  .strict();

export const materialTypePatchZ = materialTypeCreateZ.partial();

export const materialTypeRowListZ = z.array(materialTypeRowZ);

export type MaterialTypeRow = z.infer<typeof materialTypeRowZ>;
export type MaterialTypeCreate = z.infer<typeof materialTypeCreateZ>;
export type MaterialTypePatch = z.infer<typeof materialTypePatchZ>;