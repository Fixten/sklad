import { resolve } from "node:path";

import Sqlite from "better-sqlite3";

import { ErrorMessages } from "@/constants/Errors.js";
import { Logger } from "@/utils/logger.js";

export function getSqlitePath(
  baseDir: string = resolve(import.meta.dirname, "../.."),
) {
  const { SQLITE } = process.env;
  if (SQLITE) {
    return resolve(baseDir, SQLITE);
  } else throw new Error(ErrorMessages.NO_SQLITE_PATH_IN_ENV);
}

const memoryPath = ":memory:";

export function createSqlite(isMemory: boolean) {
  const path = isMemory ? memoryPath : getSqlitePath();
  const db = new Sqlite(path, {
    verbose: process.env.NODE_ENV === "development" ? Logger.log : undefined,
  });
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}
