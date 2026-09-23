import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

export const supplyRowZ = z
  .object({
    id: z.int(),
    description: z.string().nullish(),
    price: z.int().nullish(),
    count: z.int().nullish(),
    variant: z.int(),
    supplier: z.int().nullish(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const supplyCreateZ = z
  .object({
    description: z.string().optional(),
    price: z.int().optional(),
    count: z.int().optional(),
    variant: z.int(),
    supplier: z.int().optional(),
  })
  .strict();

export const supplyUpdateZ = supplyCreateZ.partial();

export const supplyRowListZ = z.array(supplyRowZ);

export type SupplyRow = z.infer<typeof supplyRowZ>;
export type SupplyCreate = z.infer<typeof supplyCreateZ>;
export type SupplyUpdate = z.infer<typeof supplyUpdateZ>;