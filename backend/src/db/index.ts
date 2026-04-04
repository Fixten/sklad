import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import schemas from "./schema/index.js";
import { createSqlite } from "./createSqlite.js";

export class Db<TSchema extends Record<string, unknown>> {
  base?: Database.Database;
  private orm?: BetterSQLite3Database<TSchema>;

  constructor(
    public isMemory: boolean = false,
    public schema: TSchema,
  ) {}

  connect() {
    this.base = createSqlite(this.isMemory);
    this.orm = drizzle(this.base, {
      schema: this.schema,
    });
    return this.orm;
  }

  get client() {
    return this.base?.open && this.orm ? this.orm : this.connect();
  }

  close() {
    this.base?.close();
  }
}

const singleton = new Db(false, schemas);
export type DB = typeof singleton;
export type DbClient = DB["client"];

export default singleton;
