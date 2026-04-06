import { integer, text } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

export const supplierTable = "supplier";

export const supplierSchema = getSchema(supplierTable, {
  ...defaultDbFields,
  description: text(),
  supplier: text().notNull(),
  supply_url: text(),
  deleted: integer({ mode: "boolean" }).default(false),
});

export type SupplierSchema = SchemaType<typeof supplierSchema>;
export type SupplierModel = SchemaModel<SupplierSchema>;
