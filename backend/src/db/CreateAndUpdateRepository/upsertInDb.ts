import { SQLiteTable } from "drizzle-orm/sqlite-core";
import { Db } from "../index.js";
import { SQL } from "drizzle-orm";
import updateInDb from "./updateInDb.js";
import { insertInDb } from "./insertInDb.js";

export default async function upsertInDb<
  TSchema extends Record<string, unknown>,
  T extends SQLiteTable,
>(
  dbClient: Db<TSchema>["client"],
  schema: T,
  value: T["$inferInsert"],
  where: SQL,
) {
  const result = await updateInDb(dbClient, schema, value, where);
  if (result) return result;
  else {
    const insertResult = await insertInDb(dbClient, schema, value);
    return insertResult ? [insertResult] : null;
  }
}
