import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

import {
  materialTypeSchema,
  materialTypeTable,
} from "@/features/materialType/materialType.schema.js";
import {
  settingsSchema,
  settingsTable,
} from "@/features/settings/settings.schema.js";
import {
  materialSchema,
  materialTable,
} from "@/features/material/material.schema.js";
import {
  materialVariantSchema,
  materialVariantTable,
} from "@/features/materialVariant/materialVariant.schema.js";
import {
  supplierSchema,
  supplierTable,
} from "@/features/supplier/supplier.schema.js";
import { supplySchema, supplyTable } from "@/features/supply/supply.schema.js";

const shemas = {
  [materialTable]: materialSchema,
  [materialTypeTable]: materialTypeSchema,
  [materialVariantTable]: materialVariantSchema,
  [supplierTable]: supplierSchema,
  [supplyTable]: supplySchema,
  [settingsTable]: settingsSchema,
};

export default shemas;

export interface BaseSchema extends SQLiteTable {
  id: SQLiteColumn;
  updated_at: SQLiteColumn;
  created_at: SQLiteColumn;
}
