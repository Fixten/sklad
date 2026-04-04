import { SQLiteTable } from "drizzle-orm/sqlite-core";
import type { DbClient } from "../index.js";
import { insertInDb } from "./insertInDb.js";
import updateInDb from "./updateInDb.js";
import upsertInDb from "./upsertInDb.js";
import { SQL } from "drizzle-orm";

const nullError = "Db operation failed";

export async function throwIfNull<T>(
  dbResponse: Promise<T | null>,
  message?: string,
): Promise<T> {
  const result = await dbResponse;
  if (result === null) throw new Error(message ?? nullError);
  else return result;
}

export default class CreateAndUpdateRepository<T extends SQLiteTable> {
  private insert = insertInDb;
  private update = updateInDb;
  private upsert = upsertInDb;

  constructor(
    private dbClient: DbClient,
    private schema: T,
  ) {}

  insertDoc(document: T["$inferInsert"]) {
    return throwIfNull(this.insert(this.dbClient, this.schema, document));
  }

  updateDoc(where: SQL, value: T["$inferInsert"], upsert: boolean = false) {
    const args = [this.dbClient, this.schema, value, where] as const;
    return throwIfNull(upsert ? this.upsert(...args) : this.update(...args));
  }
}
