import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import Sqlite from "better-sqlite3";

import { ErrorMessages } from "@/constants/Errors.js";

import {
  backupDatabase,
  getBackupsPath,
  hasPendingMigrations,
} from "./migrate.js";

const MIGRATIONS_TABLE = "__drizzle_migrations";

function createMigrationsTable(db: Sqlite.Database) {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at numeric
    )`,
  ).run();
}

function insertMigration(
  db: Sqlite.Database,
  createdAt: number,
  hash = "hash",
) {
  db.prepare(
    `INSERT INTO ${MIGRATIONS_TABLE} (hash, created_at) VALUES (?, ?)`,
  ).run(hash, createdAt);
}

describe("migrate utilities", () => {
  const originalBackups = process.env.BACKUPS;
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "migrate-test-"));
  });

  afterEach(() => {
    if (originalBackups === undefined) delete process.env.BACKUPS;
    else process.env.BACKUPS = originalBackups;

    rmSync(tempDir, { recursive: true, force: true });
  });

  describe("getBackupsPath", () => {
    it("throws when BACKUPS is not set", () => {
      delete process.env.BACKUPS;
      expect(() => getBackupsPath()).toThrow(
        ErrorMessages.NO_BACKUPS_PATH_IN_ENV,
      );
    });

    it("returns BACKUPS verbatim when set", () => {
      const path = "/prod/backups";
      process.env.BACKUPS = path;
      expect(getBackupsPath()).toBe(path);
    });
  });

  describe("hasPendingMigrations", () => {
    it("returns true for a fresh database with no migrations table", () => {
      const db = new Sqlite(":memory:");
      expect(hasPendingMigrations(db)).toBe(true);
      db.close();
    });

    it("returns true when migrations table exists but is empty", () => {
      const db = new Sqlite(":memory:");
      createMigrationsTable(db);
      expect(hasPendingMigrations(db)).toBe(true);
      db.close();
    });

    it("returns true when last applied migration is older than journal migrations", () => {
      const db = new Sqlite(":memory:");
      createMigrationsTable(db);
      insertMigration(db, 0);
      expect(hasPendingMigrations(db)).toBe(true);
      db.close();
    });

    it("returns false when last applied migration is newer than all journal migrations", () => {
      const db = new Sqlite(":memory:");
      createMigrationsTable(db);
      insertMigration(db, Number.MAX_SAFE_INTEGER);
      expect(hasPendingMigrations(db)).toBe(false);
      db.close();
    });
  });

  describe("backupDatabase", () => {
    it("creates backups directory and writes a timestamped backup file", async () => {
      const db = new Sqlite(":memory:");
      db.prepare("CREATE TABLE t (id INTEGER PRIMARY KEY)").run();
      db.prepare("INSERT INTO t (id) VALUES (1)").run();

      const backupsDir = join(tempDir, "backups");
      const file = await backupDatabase(db, backupsDir, 5);

      expect(file).toContain(backupsDir);
      expect(file).toMatch(/db-.*\.sql$/);

      const backupDb = new Sqlite(file, { readonly: true });
      const row = backupDb
        .prepare(
          "SELECT count(*) as c FROM sqlite_master WHERE type = 'table' AND name = 't'",
        )
        .get() as { c: number };
      expect(row.c).toBe(1);
      const data = backupDb.prepare("SELECT id FROM t").get() as { id: number };
      expect(data.id).toBe(1);
      backupDb.close();
      db.close();
    });

    it("prunes backups keeping only the newest N", async () => {
      const db = new Sqlite(":memory:");
      const backupsDir = join(tempDir, "backups");

      await backupDatabase(db, backupsDir, 3);
      await new Promise((resolve) => setTimeout(resolve, 5));
      await backupDatabase(db, backupsDir, 3);
      await new Promise((resolve) => setTimeout(resolve, 5));
      await backupDatabase(db, backupsDir, 3);
      await new Promise((resolve) => setTimeout(resolve, 5));
      await backupDatabase(db, backupsDir, 3);

      const files = (
        await import("node:fs/promises").then((m) => m.readdir(backupsDir))
      )
        .filter((f) => f.endsWith(".sql"))
        .sort();
      expect(files.length).toBe(3);
      const all = (
        await import("node:fs/promises").then((m) => m.readdir(backupsDir))
      ).sort();
      const newest = all.filter((f) => f.endsWith(".sql")).reverse()[0]!;
      expect(files.includes(newest)).toBe(true);
      db.close();
    });

    it("does not prune non-backup files in the backups directory", async () => {
      const db = new Sqlite(":memory:");
      const backupsDir = join(tempDir, "backups");
      await import("node:fs/promises").then((m) =>
        m.mkdir(backupsDir, { recursive: true }),
      );
      await import("node:fs/promises").then((m) =>
        m.writeFile(join(backupsDir, "notes.txt"), "keep"),
      );
      await import("node:fs/promises").then((m) =>
        m.writeFile(join(backupsDir, "db-old.sql-wal"), "wal"),
      );

      await backupDatabase(db, backupsDir, 1);

      const files = await import("node:fs/promises").then((m) =>
        m.readdir(backupsDir),
      );
      expect(files).toContain("notes.txt");
      expect(files).toContain("db-old.sql-wal");
      expect(files.filter((f) => f.endsWith(".sql")).length).toBe(1);
      db.close();
    });
  });
});
