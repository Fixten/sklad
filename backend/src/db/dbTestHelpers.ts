import { text } from "drizzle-orm/sqlite-core";

import { defaultDbFields } from "./schema/defaultFields.js";
import { getSchema } from "./schema/createSchema.js";
import Db from "./index.js";

const table = "test";

export const testSchema = getSchema(table, {
  id: defaultDbFields.id,
  name: text().notNull(),
});

export function getTestDb() {
  const db = new Db(true, { test: testSchema });

  db.client.$client
    .prepare(
      `
    CREATE TABLE ${table} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `,
    )
    .run();
  return db;
}
