import { sql } from "drizzle-orm";
import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

export const productTemplateTable = "product_templates";

export const productTemplateSchema = getSchema(
  productTemplateTable,
  {
    ...defaultDbFields,
    name: text().notNull(),
    description: text(),
    production_instructions: text(),
    drawing_description: text(),
    expected_production_work_hours: integer(),
    development_work_hours: integer(),
  },
  (table) => [
    uniqueIndex("product_templates_name_unique").on(
      sql`trim(${table.name}) COLLATE NOCASE`,
    ),
  ],
);

export type ProductTemplateSchema = SchemaType<typeof productTemplateSchema>;
export type ProductTemplateModel = SchemaModel<ProductTemplateSchema>;
