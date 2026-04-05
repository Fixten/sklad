import { int } from "drizzle-orm/sqlite-core";

import {
  getSchema,
  SchemaModel,
  SchemaType,
} from "@/db/schema/createSchema.js";
import { defaultDbFields } from "@/db/schema/defaultFields.js";

export const settingsTable = "settings";
export const settingsId = 1;

export const settingsSchema = getSchema(settingsTable, {
  ...defaultDbFields,
  id: int().primaryKey().default(settingsId),
  work_hour_cost: int().default(500).notNull(),
});

export type SettingsSchema = SchemaType<typeof settingsSchema>;
export type SettingsModel = SchemaModel<SettingsSchema>;
