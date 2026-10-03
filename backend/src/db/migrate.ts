import { mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import Sqlite from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";

import { ErrorMessages } from "@/constants/Errors.js";
import { DbClient } from "@/db/index.js";

const migrationsFolder = fileURLToPath(
  new URL("../../drizzle", import.meta.url),
);

const MIGRATIONS_TABLE = "__drizzle_migrations";

const BACKUP_PATTERN = /^db-.*\.sql$/u;

export function applyMigrations(db: DbClient) {
  migrate(db, { migrationsFolder });
}

/**
 * Mirrors the rule drizzle itself applies: a migration is pending when its
 * `folderMillis` is newer than the newest row in the migrations table.
 */
export function hasPendingMigrations(db: Sqlite.Database): boolean {
  const files = readMigrationFiles({ migrationsFolder });
  if (files.length === 0) return false;

  const table = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(MIGRATIONS_TABLE);
  if (!table) return true;

  const applied = db
    .prepare(`SELECT MAX(created_at) AS last FROM ${MIGRATIONS_TABLE}`)
    .get() as { last: number | null } | undefined;
  const lastApplied = applied?.last ?? null;

  return (
    lastApplied === null ||
    files.some((file) => file.folderMillis > lastApplied)
  );
}

function backupName(now: Date): string {
  return `db-${now.toISOString().replace(/[:.]/gu, "-")}.sql`;
}

export function getBackupsPath(): string {
  const { BACKUPS } = process.env;
  if (!BACKUPS) throw new Error(ErrorMessages.NO_BACKUPS_PATH_IN_ENV);
  return BACKUPS;
}

async function pruneBackups(dir: string, keep: number): Promise<void> {
  const names = (await readdir(dir))
    .filter((name) => BACKUP_PATTERN.test(name))
    .sort()
    .reverse();

  await Promise.all(names.slice(keep).map((name) => rm(join(dir, name))));
}

export async function backupDatabase(
  db: Sqlite.Database,
  dir: string,
  keep = 5,
): Promise<string> {
  await mkdir(dir, { recursive: true });
  const file = join(dir, backupName(new Date()));

  await db.backup(file);
  await pruneBackups(dir, keep);

  return file;
}
