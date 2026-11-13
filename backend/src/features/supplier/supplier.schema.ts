import { sql } from "drizzle-orm";
import { text, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

export const supplierTable = "suppliers";

export const supplierSchema = getSchema(
  supplierTable,
  {
    ...defaultDbFields,
    name: text().notNull(),
    description: text(),
    url: text(),
    contact: text(),
  },
  (table) => [
    uniqueIndex("suppliers_name_unique").on(
      sql`trim(${table.name}) COLLATE NOCASE`,
    ),
  ],
);

export type SupplierSchema = SchemaType<typeof supplierSchema>;
export type SupplierModel = SchemaModel<SupplierSchema>;
