import { SQL } from "drizzle-orm";
import { SQLiteTable } from "drizzle-orm/sqlite-core";

import { ErrorMessages } from "@/constants/Errors.js";

import { insertInDb } from "./insertInDb.js";
import updateInDb from "./updateInDb.js";
import upsertInDb from "./upsertInDb.js";

import type { Db } from "../index.js";
import type { IndexColumn } from "drizzle-orm/sqlite-core";

export function throwIfNull<T>(dbResponse: T | null, message?: string): T {
  if (dbResponse === null)
    throw new Error(message ?? ErrorMessages.DB_OPERATION_FAILED);
  else return dbResponse;
}

export default class CreateAndUpdateRepository<T extends SQLiteTable> {
  private insert = insertInDb;
  private update = updateInDb;
  private upsert = upsertInDb;

  constructor(
    private dbClient: Db<Record<string, unknown>>["client"],
    private schema: T,
  ) {}

  insertDoc(document: T["$inferInsert"]) {
    return throwIfNull(this.insert(this.dbClient, this.schema, document));
  }

  updateDoc(where: SQL, value: T["$inferInsert"]) {
    return throwIfNull(
      this.update(this.dbClient, this.schema, value, where),
      ErrorMessages.ITEM_NOT_FOUND,
    );
  }

  upsertDoc(target: IndexColumn | IndexColumn[], value: T["$inferInsert"]) {
    return throwIfNull(this.upsert(this.dbClient, this.schema, value, target));
  }
}
