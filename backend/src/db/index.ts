import Sqlite from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";

import { createSqlite } from "./createSqlite.js";
import schemas from "./schema/index.js";

export class Db<TSchema extends Record<string, unknown>> {
  base?: Sqlite.Database;
  private orm?: BetterSQLite3Database<TSchema>;

  constructor(
    public isMemory = false,
    public schema: TSchema,
  ) {}

  private connect() {
    this.base = createSqlite(this.isMemory);
    this.orm = drizzle(this.base, {
      schema: this.schema,
    });
    return this.orm;
  }

  get client() {
    return this.base?.open && this.orm ? this.orm : this.connect();
  }

  init() {
    void this.client;
  }

  close() {
    this.base?.close();
  }
}

const singleton = new Db(process.env.NODE_ENV === "test", schemas);
export type DB = typeof singleton;
export type DbClient = DB["client"];

export default singleton;
