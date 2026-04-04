import { drizzle } from "drizzle-orm/better-sqlite3";

import schemas from "./schema/index.js";
import { createSqlite } from "./createSqlite.js";

export class Db<TSchema extends Record<string, unknown>> {
  private base;
  client;
  constructor(isMemory: boolean = false, schema: TSchema) {
    this.base = createSqlite(isMemory);
    this.client = drizzle(this.base, {
      schema,
    });
  }

  close() {
    this.base.close();
  }
}

const getDb = () => new Db(false, schemas);
export type DB = ReturnType<typeof getDb>;
export type DbClient = DB["client"];

export default Db;
