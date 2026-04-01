import { drizzle } from "drizzle-orm/better-sqlite3";

import { createSqlite } from "./createSqlite.js";

const db = drizzle({ client: createSqlite() });

export type Db = typeof db;

export default db;
