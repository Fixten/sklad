import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

import {
  materialSchema,
  materialTable,
} from "@/features/material/material.schema.js";
import {
  materialTypeSchema,
  materialTypeTable,
} from "@/features/materialType/materialType.schema.js";
import {
  materialVariantSchema,
  materialVariantTable,
} from "@/features/materialVariant/materialVariant.schema.js";
import {
  settingsSchema,
  settingsTable,
} from "@/features/settings/settings.schema.js";
import {
  supplierSchema,
  supplierTable,
} from "@/features/supplier/supplier.schema.js";
import { supplySchema, supplyTable } from "@/features/supply/supply.schema.js";

export {
  materialSchema,
  materialTypeSchema,
  materialVariantSchema,
  settingsSchema,
  supplierSchema,
  supplySchema,
};
const schemas = {
  [materialTable]: materialSchema,
  [materialTypeTable]: materialTypeSchema,
  [materialVariantTable]: materialVariantSchema,
  [supplierTable]: supplierSchema,
  [supplyTable]: supplySchema,
  [settingsTable]: settingsSchema,
};

export default schemas;

export interface BaseSchema extends SQLiteTable {
  id: SQLiteColumn;
  updated_at: SQLiteColumn;
  created_at: SQLiteColumn;
  deleted_at: SQLiteColumn;
}