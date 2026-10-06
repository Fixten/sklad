import { SQLiteTable } from "drizzle-orm/sqlite-core";

import { WithDb } from "../WithDb.js";

import type { Db } from "../index.js";

export function insertInDb<
  TSchema extends Record<string, unknown>,
  T extends SQLiteTable,
>(dbClient: Db<TSchema>["client"], schema: T, document: T["$inferInsert"]) {
  const result = dbClient
    .insert(schema)
    .values(document)
    .returning()
    .all() as unknown as WithDb<T["$inferSelect"]>[];
  return result.length > 0 ? result[0] : null;
}
