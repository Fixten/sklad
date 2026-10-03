import { integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

import { productTemplateSchema } from "./productTemplate.schema.js";

export const productItemTable = "product_items";

export const productItemSchema = getSchema(productItemTable, {
  ...defaultDbFields,
  product_template_id: integer("product_template_id")
    .references(() => productTemplateSchema.id)
    .notNull(),
  notes: text(),
  modifications: text(),
  actual_production_work_hours: integer(),
  additional_cost: integer(),
});

export type ProductItemSchema = SchemaType<typeof productItemSchema>;
export type ProductItemModel = SchemaModel<ProductItemSchema>;
