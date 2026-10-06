import { getTestDb, testSchema } from "../dbTestHelpers.js";

import { insertInDb } from "./insertInDb.js";

describe("insertInDb", () => {
  test("should insert value in db", () => {
    const db = getTestDb();
    insertInDb(db.client, testSchema, { name: "test" });
    const result = db.client.select().from(testSchema).all();
    expect(result.length).toBe(1);
    db.close();
  });
  test("should return value if success", () => {
    const db = getTestDb();
    const result = insertInDb(db.client, testSchema, { name: "test" });
    expect(result?.name).toBe("test");
    db.close();
  });
  test("should throw if value is not correct", () => {
    const db = getTestDb();
    expect(() =>
      insertInDb(db.client, testSchema, {
        test: "test",
      } as unknown as {
        name: string;
      }),
    ).toThrow();
    db.close();
  });
});
