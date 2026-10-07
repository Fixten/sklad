import { eq } from "drizzle-orm";

import { getTestDb, testSchema } from "../dbTestHelpers.js";

import { insertInDb } from "./insertInDb.js";
import updateInDb from "./updateInDb.js";

import type { TestDb } from "../dbTestHelpers.js";

describe("update", () => {
  const original = "test";
  const value = "update";
  let db: TestDb;

  beforeEach(() => {
    db = getTestDb();
    insertInDb(db.client, testSchema, { name: original });
  });

  afterEach(() => {
    db.close();
  });

  it("updated doc in db", () => {
    updateInDb(
      db.client,
      testSchema,
      { name: value },
      eq(testSchema.name, original),
    );
    const result = db.client.select().from(testSchema).all();
    expect(result[0]!.name).toBe(value);
  });

  it("return updated doc", () => {
    const result = updateInDb(
      db.client,
      testSchema,
      { name: value },
      eq(testSchema.name, original),
    );
    expect(result?.[0]!.name).toBe(value);
  });
  it("return null if no target", () => {
    const result = updateInDb(
      db.client,
      testSchema,
      { name: value },
      eq(testSchema.name, "something"),
    );
    expect(result).toEqual(null);
  });
  it("sets updated_at field", () => {
    const base = db.client.select().from(testSchema).all();
    expect(base[0]!.updated_at).toBe(null);
    const result = updateInDb(
      db.client,
      testSchema,
      { name: value },
      eq(testSchema.name, original),
    );

    expect(typeof result?.[0]?.updated_at).toBeTruthy();
  });
});
