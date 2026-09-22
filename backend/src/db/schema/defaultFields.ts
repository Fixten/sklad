import { integer } from "drizzle-orm/sqlite-core";

export const defaultDbFields = {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  updated_at: integer({ mode: "timestamp" }),
  created_at: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  deleted_at: integer({ mode: "timestamp" }),
};
