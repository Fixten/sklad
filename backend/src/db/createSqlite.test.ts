import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";

import { createSqlite, getSqlitePath } from "./createSqlite.js";

describe("createSqlite", () => {
  const originalSqlite = process.env.SQLITE;
  const originalCwd = process.cwd();

  afterEach(() => {
    if (originalSqlite === undefined) delete process.env.SQLITE;
    else process.env.SQLITE = originalSqlite;
    process.chdir(originalCwd);
  });

  describe("getSqlitePath", () => {
    it("throws when SQLITE is not set", () => {
      delete process.env.SQLITE;
      expect(() => getSqlitePath()).toThrow("No sqlite path string in env");
    });

    it("resolves a relative SQLITE against the given base directory", () => {
      process.env.SQLITE = "../data/db.sql";
      const base = mkdtempSync(join(tmpdir(), "sklad-base-"));

      expect(getSqlitePath(base)).toBe(resolve(base, "../data/db.sql"));
    });

    it("resolves a nested relative SQLITE against the given base directory", () => {
      process.env.SQLITE = "nested/db.sql";
      const base = mkdtempSync(join(tmpdir(), "sklad-base-"));

      expect(getSqlitePath(base)).toBe(resolve(base, "nested/db.sql"));
    });

    it("passes an absolute SQLITE through untouched", () => {
      const absolute = join(
        mkdtempSync(join(tmpdir(), "sklad-abs-")),
        "db.sql",
      );
      process.env.SQLITE = absolute;
      const base = mkdtempSync(join(tmpdir(), "sklad-base-"));

      expect(getSqlitePath(base)).toBe(absolute);
      expect(isAbsolute(getSqlitePath(base))).toBe(true);
    });

    it("ignores the working directory", () => {
      process.env.SQLITE = "../data/db.sql";
      const base = mkdtempSync(join(tmpdir(), "sklad-base-"));
      const expected = resolve(base, "../data/db.sql");

      process.chdir(tmpdir());
      expect(getSqlitePath(base)).toBe(expected);

      process.chdir(mkdtempSync(join(tmpdir(), "sklad-cwd-")));
      expect(getSqlitePath(base)).toBe(expected);
    });

    it("resolves a relative SQLITE against the backend package by default", () => {
      process.env.SQLITE = "../data/db.sql";
      const expected = join("data", "db.sql");

      expect(getSqlitePath().endsWith(expected)).toBe(true);
      expect(getSqlitePath()).toContain(join("backend", "..", "data"));
    });

    it("keeps the default base when the working directory changes", () => {
      process.env.SQLITE = "../data/db.sql";
      const expected = getSqlitePath();

      process.chdir(tmpdir());
      expect(getSqlitePath()).toBe(expected);

      process.chdir(mkdtempSync(join(tmpdir(), "sklad-cwd-")));
      expect(getSqlitePath()).toBe(expected);
    });
  });

  describe("createSqlite", () => {
    it("uses an in-memory database without reading SQLITE", () => {
      delete process.env.SQLITE;
      const db = createSqlite(true);
      expect(db.memory).toBe(true);
      expect(
        db.prepare("select count(*) as c from sqlite_master").get(),
      ).toEqual({ c: 0 });
      db.close();
    });

    it("opens the configured file when not in memory", () => {
      const dir = mkdtempSync(join(tmpdir(), "sklad-file-"));
      process.env.SQLITE = join(dir, "db.sql");

      const db = createSqlite(false);
      expect(db.memory).toBe(false);
      expect(db.name).toBe(resolve(dir, "db.sql"));
      db.close();
    });
  });
});
