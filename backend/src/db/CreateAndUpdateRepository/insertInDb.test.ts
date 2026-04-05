import { getTestDb, testSchema } from "../dbTestHelpers.js";

import { insertInDb } from "./insertInDb.js";

describe("insertInDb", () => {
  test("should insert value in db", async () => {
    const db = getTestDb();
    await insertInDb(db.client, testSchema, { name: "test" });
    const result = await db.client.select().from(testSchema);
    expect(result.length).toBe(1);
    db.close();
  });
  test("should return value if success", async () => {
    const db = getTestDb();
    const result = await insertInDb(db.client, testSchema, { name: "test" });
    expect(result?.name).toBe("test");
    db.close();
  });
  test("should throw if value is not correct", async () => {
    const db = getTestDb();
    await expect(
      insertInDb(db.client, testSchema, {
        test: "test",
      } as unknown as {
        name: string;
      }),
    ).rejects.toBeTruthy();
    db.close();
  });
});
