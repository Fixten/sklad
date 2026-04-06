import { resolve } from "node:path";
import { cwd } from "node:process";

import Sqlite from "better-sqlite3";

export function getSqlitePath() {
  const { SQLITE } = process.env;
  if (SQLITE) {
    return resolve(cwd(), SQLITE);
  } else throw new Error("No sqlite path string in env");
}

const memoryPath = ":memory:";

export function createSqlite(isMemory: boolean) {
  const path = isMemory ? memoryPath : getSqlitePath();
  const db = new Sqlite(path, {
    verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
  });
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}
