import { z } from "zod";

import { dateZ } from "@/openapi/common.zod.js";

export const supplierRowZ = z
  .object({
    id: z.int(),
    name: z.string(),
    description: z.string().nullish(),
    url: z.string().nullish(),
    contact: z.string().nullish(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const supplierCreateZ = z
  .object({
    name: z.string().trim().min(1),
    description: z.string().optional(),
    url: z.string().optional(),
    contact: z.string().optional(),
  })
  .strict();

export const supplierPatchZ = supplierCreateZ.partial();

export const supplierRowListZ = z.array(supplierRowZ);

export type SupplierRow = z.infer<typeof supplierRowZ>;
export type SupplierCreate = z.infer<typeof supplierCreateZ>;
export type SupplierPatch = z.infer<typeof supplierPatchZ>;
