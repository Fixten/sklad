import { integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { materialVariantSchema } from "../materialVariant/materialVariant.schema.js";

export const supplyTable = "supply";

export const supplySchema = getSchema(supplyTable, {
  ...defaultDbFields,
  description: text().notNull(),
  supplier: text(),
  supply_url: text(),
  unit: text(),
  price: integer(),
  count: integer(),
  variant: integer("material_variant_id")
    .references(() => materialVariantSchema.id)
    .notNull(),
});

export type SupplySchema = SchemaType<typeof supplySchema>;
export type SupplyModel = SchemaModel<SupplySchema>;
