import { integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { supplierSchema } from "../supplier/supplier.schema.js";

export const supplyTable = "supply";

export const supplySchema = getSchema(supplyTable, {
  ...defaultDbFields,
  description: text(),
  price: integer(),
  count: integer(),
  variant: integer("material_variant_id")
    .references(() => materialVariantSchema.id)
    .notNull(),
  supplier: integer("supplier_id").references(() => supplierSchema.id),
});

export type SupplySchema = SchemaType<typeof supplySchema>;
export type SupplyModel = SchemaModel<SupplySchema>;