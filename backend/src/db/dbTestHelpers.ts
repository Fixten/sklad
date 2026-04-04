import { text } from "drizzle-orm/sqlite-core";

import { defaultDbFields } from "./schema/defaultFields.js";
import { getSchema } from "./schema/createSchema.js";
import { Db } from "./index.js";

const table = "test";

export const testSchema = getSchema(table, {
  ...defaultDbFields,
  name: text().notNull(),
});

const dbSchema = { test: testSchema };

export type TestDb = Db<typeof dbSchema>;

export function getTestDb(): TestDb {
  const db = new Db(true, dbSchema);
  db.connect();
  db.base
    ?.prepare(
      `
    CREATE TABLE ${table} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      updated_at INTEGER,
      created_at INTEGER
    );
  `,
    )
    .run();
  return db;
}
