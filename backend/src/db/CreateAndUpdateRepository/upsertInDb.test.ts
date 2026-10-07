import { getTestDb, testSchema } from "../dbTestHelpers.js";

import { insertInDb } from "./insertInDb.js";
import upsertInDb from "./upsertInDb.js";

import type { TestDb } from "../dbTestHelpers.js";

describe("upsertInDb", () => {
  const name = "test";
  const other = "other";
  let db: TestDb;

  beforeEach(() => {
    db = getTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it("inserts when no row has the target id", () => {
    const result = upsertInDb(
      db.client,
      testSchema,
      { id: 1, name },
      testSchema.id,
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]!.name).toBe(name);
    expect(db.client.select().from(testSchema).all()).toHaveLength(1);
  });

  it("updates when a row already has the target id", () => {
    insertInDb(db.client, testSchema, { id: 1, name });

    const result = upsertInDb(
      db.client,
      testSchema,
      { id: 1, name: other },
      testSchema.id,
    );
    expect(result).toHaveLength(1);
    expect(result?.[0]!.name).toBe(other);

    const rows = db.client.select().from(testSchema).all();
    expect(rows).toHaveLength(1);
    expect(rows[0]!.name).toBe(other);
  });

  it("leaves updated_at null on insert and stamps it on update", () => {
    const inserted = upsertInDb(
      db.client,
      testSchema,
      { id: 1, name },
      testSchema.id,
    );
    expect(inserted?.[0]!.updated_at).toBeNull();

    const updated = upsertInDb(
      db.client,
      testSchema,
      { id: 1, name: other },
      testSchema.id,
    );
    expect(updated?.[0]!.updated_at).toBeInstanceOf(Date);
  });

  it("only writes the passed columns on the conflict branch", () => {
    const created = new Date("2024-01-01T00:00:00Z");
    insertInDb(db.client, testSchema, { id: 1, name, created_at: created });

    const updated = upsertInDb(
      db.client,
      testSchema,
      { id: 1, name: other },
      testSchema.id,
    );

    expect(updated?.[0]!.name).toBe(other);
    expect(updated?.[0]!.created_at).toEqual(created);
    expect(updated?.[0]!.deleted_at).toBeNull();
  });
});
