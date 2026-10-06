import { sql } from "drizzle-orm";
import { check, integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { supplierSchema } from "../supplier/supplier.schema.js";

export const supplyTable = "supplies";

export const supplySchema = getSchema(
  supplyTable,
  {
    ...defaultDbFields,
    description: text(),
    purchase_price: integer("purchase_price").notNull(),
    quantity: integer("quantity").notNull(),
    url: text("url"),
    material_variant_id: integer("material_variant_id")
      .references(() => materialVariantSchema.id, { onDelete: "restrict" })
      .notNull(),
    supplier_id: integer("supplier_id").references(() => supplierSchema.id, {
      onDelete: "restrict",
    }),
  },
  (table) => [
    check("supplies_quantity_positive", sql`${table.quantity} > 0`),
    check(
      "supplies_purchase_price_non_negative",
      sql`${table.purchase_price} >= 0`,
    ),
  ],
);

export type SupplySchema = SchemaType<typeof supplySchema>;
export type SupplyModel = SchemaModel<SupplySchema>;
