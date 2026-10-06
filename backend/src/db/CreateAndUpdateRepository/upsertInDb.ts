import { sql } from "drizzle-orm";
import { IndexColumn, SQLiteTable } from "drizzle-orm/sqlite-core";

import { Db } from "../index.js";

export default function upsertInDb<
  TSchema extends Record<string, unknown>,
  T extends SQLiteTable,
>(
  dbClient: Db<TSchema>["client"],
  schema: T,
  value: T["$inferInsert"],
  target: IndexColumn | IndexColumn[],
) {
  const actualUpdate = Object.assign({}, value, {
    updated_at: sql`(unixepoch())`,
  });
  const result = dbClient
    .insert(schema)
    .values(value)
    .onConflictDoUpdate({ target, set: actualUpdate })
    .returning()
    .all() as T["$inferSelect"][];
  return result.length > 0 ? result : null;
}
