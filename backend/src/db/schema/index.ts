import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

import {
  materialTypeSchema,
  materialTypeTable,
} from "@/features/materialType/materialType.schema.js";
import {
  settingsSchema,
  settingsTable,
} from "@/features/settings/settings.schema.js";

const shemas = {
  [settingsTable]: settingsSchema,
  [materialTypeTable]: materialTypeSchema,
};

export default shemas;

export interface BaseSchema extends SQLiteTable {
  id: SQLiteColumn;
  updated_at: SQLiteColumn;
  created_at: SQLiteColumn;
}
