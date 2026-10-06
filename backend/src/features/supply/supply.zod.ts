import { z } from "zod";

import { MATERIAL_UNITS } from "@/features/materialVariant/utils/quantity.js";
import { dateZ } from "@/openapi/common.zod.js";

/**
 * Money and quantities travel as decimals and are converted to kopecks and
 * scaled integers in the service layer, so the wire accepts both JSON numbers
 * and decimal strings to stay exact.
 */
const decimalZ = z.union([z.number(), z.string()]);

export const supplyRowZ = z
  .object({
    id: z.int(),
    description: z.string().nullish(),
    purchase_price: z.number(),
    quantity: z.number(),
    unit: z.enum(MATERIAL_UNITS),
    remaining_quantity: z.number(),
    unit_purchase_cost: z.number(),
    url: z.string().nullish(),
    material_variant_id: z.int(),
    supplier_id: z.int().nullish(),
    created_at: dateZ,
    updated_at: dateZ.nullish(),
    deleted_at: dateZ.nullish(),
  })
  .strict();

export const supplyCreateZ = z
  .object({
    description: z.string().optional(),
    purchase_price: decimalZ,
    quantity: decimalZ,
    url: z.string().optional(),
    material_variant_id: z.int(),
    supplier_id: z.int().optional(),
  })
  .strict();

export const supplyPatchZ = supplyCreateZ.partial();

export const supplyListQueryZ = z
  .object({
    material_variant_id: z.coerce.number().int().optional(),
    supplier_id: z.coerce.number().int().optional(),
  })
  .strict();

export const supplyRowListZ = z.array(supplyRowZ);

export const supplyStockZ = z
  .object({
    material_variant_id: z.int(),
    unit: z.enum(MATERIAL_UNITS),
    quantity: z.number(),
  })
  .strict();

export type SupplyRow = z.infer<typeof supplyRowZ>;
export type SupplyCreate = z.infer<typeof supplyCreateZ>;
export type SupplyPatch = z.infer<typeof supplyPatchZ>;
export type SupplyListQuery = z.infer<typeof supplyListQueryZ>;
