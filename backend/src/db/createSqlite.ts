import { resolve } from "node:path";
import { cwd } from "node:process";
import Database from "better-sqlite3";

export function getSqlitePath() {
  const { SQLITE } = process.env;
  if (SQLITE) {
    return SQLITE === ":memory:" ? SQLITE : resolve(cwd(), SQLITE);
  } else throw new Error("No sqlite path string in env");
}

export function createSqlite() {
  const path = getSqlitePath();
  const db = new Database(path, {
    verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
  });
  db.pragma("journal_mode = WAL");
  return db;
}
