import {
  settingsSchema,
  settingsTable,
} from "@/features/settings/settings.schema.js";
import { SQLiteColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

const shemas = {
  [settingsTable]: settingsSchema,
};

export default shemas;

export interface BaseSchema extends SQLiteTable {
  id: SQLiteColumn;
  updated_at: SQLiteColumn;
  created_at: SQLiteColumn;
}
