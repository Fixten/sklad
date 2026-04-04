import { SQLiteTable } from "drizzle-orm/sqlite-core";
import Db from "../index.js";
import { sql, SQL } from "drizzle-orm";

export default async function updateInDb<
  TSchema extends Record<string, unknown>,
  T extends SQLiteTable,
>(
  dbClient: Db<TSchema>["client"],
  schema: T,
  value: T["$inferInsert"],
  where: SQL,
) {
  const actualUpdate = Object.assign({}, value, {
    updated_at: sql`(unixepoch())`,
  });
  const result = await dbClient
    .update(schema)
    .set(actualUpdate)
    .where(where)
    .returning();
  return result.length > 0 ? result : null;
}
