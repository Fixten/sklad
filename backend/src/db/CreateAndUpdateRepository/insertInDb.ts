import { SQLiteTable } from "drizzle-orm/sqlite-core";
import type { Db } from "../index.js";
import { WithDb } from "../WithDb.js";

export async function insertInDb<
  TSchema extends Record<string, unknown>,
  T extends SQLiteTable,
>(dbClient: Db<TSchema>["client"], schema: T, document: T["$inferInsert"]) {
  const result = await dbClient.insert(schema).values(document).returning();
  return result.length > 0 ? (result[0] as WithDb<T["$inferSelect"]>) : null;
}
