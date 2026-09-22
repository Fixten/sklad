import { eq } from "drizzle-orm";

import { ErrorMessages } from "@/constants/Errors.js";

import { getTestDb, testSchema } from "./dbTestHelpers.js";
import Repository from "./repository.js";

import type { TestDb } from "./dbTestHelpers.js";

const name = "test";

describe("Repository", () => {
  let db: TestDb;
  let repository: Repository<typeof testSchema>;

  beforeEach(async () => {
    db = getTestDb();
    repository = new Repository(testSchema, db);
    await repository.addNew({ name });
  });

  afterEach(() => {
    db.close();
  });

  test("getAllActive excludes soft-deleted rows", async () => {
    await repository.addNew({ name: "second" });
    const existing = (await repository.getAll())[0];
    await repository.softDelete(existing.id);

    const active = await repository.getAllActive();
    expect(active.map((row) => row.name)).toEqual(["second"]);
  });

  test("softDelete keeps the row and sets deleted_at", async () => {
    const existing = (await repository.getAll())[0];
    const updated = await repository.softDelete(existing.id);
    expect(updated.deleted_at).toBeTruthy();

    const all = await repository.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].deleted_at).toBeTruthy();
  });

  test("getById returns the single row object", async () => {
    const result = await repository.getById(1);
    expect(result.name).toBe(name);
  });

  test("getById throws when the row does not exist", async () => {
    await expect(repository.getById(999)).rejects.toThrow(
      ErrorMessages.ITEM_NOT_FOUND,
    );
  });

  test("deleteById physically removes the row", async () => {
    await repository.deleteById(1);
    const all = await repository.getAll();
    expect(all).toHaveLength(0);
  });

  test("getByValue returns soft-deleted rows too", async () => {
    const existing = (await repository.getAll())[0];
    await repository.softDelete(existing.id);

    const result = await repository.getByValue(eq(testSchema.name, name));
    expect(result).toHaveLength(1);
    expect(result[0].deleted_at).toBeTruthy();
  });
});
