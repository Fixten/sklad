import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

export const supplierRowZ = z
  .object({
    id: z.int(),
    description: z.string().nullish(),
    supplier: z.string(),
    supply_url: z.string().nullish(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const supplierCreateZ = z
  .object({
    description: z.string().optional(),
    supplier: z.string().trim().min(1),
    supply_url: z.string().optional(),
  })
  .strict();

export const supplierUpdateZ = supplierCreateZ.partial();

export const supplierRowListZ = z.array(supplierRowZ);

export type SupplierRow = z.infer<typeof supplierRowZ>;
export type SupplierCreate = z.infer<typeof supplierCreateZ>;
export type SupplierUpdate = z.infer<typeof supplierUpdateZ>;