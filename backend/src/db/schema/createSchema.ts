import { SQLiteTable, sqliteTable } from "drizzle-orm/sqlite-core";

export const getSchema = sqliteTable;

export type SchemaType<T extends SQLiteTable> = T["$inferSelect"];

export type SchemaModel<T extends object> = Omit<
  T,
  "id" | "updated_at" | "created_at"
>;
