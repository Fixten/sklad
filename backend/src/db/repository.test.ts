import { eq } from "drizzle-orm";

import { ErrorMessages } from "@/constants/Errors.js";

import { getTestDb, testSchema } from "./dbTestHelpers.js";
import Repository from "./repository.js";

import type { TestDb } from "./dbTestHelpers.js";

const name = "test";

describe("Repository", () => {
  let db: TestDb;
  let repository: Repository<typeof testSchema>;

  beforeEach(() => {
    db = getTestDb();
    repository = new Repository(testSchema, db);
    repository.addNew({ name });
  });

  afterEach(() => {
    db.close();
  });

  test("getAllActive excludes soft-deleted rows", () => {
    repository.addNew({ name: "second" });
    const existing = repository.getAll()[0];
    repository.softDelete(existing!.id);

    const active = repository.getAllActive();
    expect(active.map((row) => row.name)).toEqual(["second"]);
  });

  test("softDelete keeps the row and sets deleted_at", () => {
    const existing = repository.getAll()[0];
    const updated = repository.softDelete(existing!.id);
    expect(updated.deleted_at).toBeTruthy();

    const all = repository.getAll();
    expect(all).toHaveLength(1);
    expect(all[0]!.deleted_at).toBeTruthy();
  });

  test("getById returns the single row object", () => {
    const result = repository.getById(1);
    expect(result.name).toBe(name);
  });

  test("getById throws when the row does not exist", () => {
    expect(() => repository.getById(999)).toThrow(ErrorMessages.ITEM_NOT_FOUND);
  });

  test("updateById throws not found when the row does not exist", () => {
    expect(() => repository.updateById(999, { name: "new" })).toThrow(
      ErrorMessages.ITEM_NOT_FOUND,
    );
  });

  test("updateById sets updated_at and returns the row", () => {
    repository.softDelete(1);
    const updated = repository.updateById(1, { name: "renamed" });
    expect(updated.name).toBe("renamed");
    expect(updated.updated_at).toBeTruthy();
  });

  test("restore clears deleted_at", () => {
    const existing = repository.getAll()[0];
    repository.softDelete(existing!.id);

    const restored = repository.restore(existing!.id);
    expect(restored.deleted_at).toBeNull();
    expect(repository.getAllActive()).toHaveLength(1);
  });

  test("deleteById physically removes the row", () => {
    repository.deleteById(1);
    expect(repository.getAll()).toHaveLength(0);
  });

  test("getByValue returns soft-deleted rows too", () => {
    const existing = repository.getAll()[0];
    repository.softDelete(existing!.id);

    const result = repository.getByValue(eq(testSchema.name, name));
    expect(result).toHaveLength(1);
    expect(result[0]!.deleted_at).toBeTruthy();
  });

  test("getActiveByValue filters soft-deleted rows", () => {
    const existing = repository.getAll()[0];
    repository.softDelete(existing!.id);

    expect(repository.getActiveByValue(eq(testSchema.name, name))).toHaveLength(
      0,
    );
  });

  describe("transaction", () => {
    function names() {
      return repository.getAll().map((row) => row.name);
    }

    test("commits the work when the operation returns", () => {
      const result = repository.transaction(() => {
        repository.addNew({ name: "second" });
        return "done";
      });

      expect(result).toBe("done");
      expect(names()).toEqual([name, "second"]);
      expect(db.inTransaction).toBe(false);
    });

    test("rolls back the work when the operation throws", () => {
      expect(() =>
        repository.transaction(() => {
          repository.addNew({ name: "second" });
          throw new Error("failed");
        }),
      ).toThrow("failed");

      expect(names()).toEqual([name]);
      expect(db.inTransaction).toBe(false);
    });

    test("the driver rejects an async operation and rolls it back", () => {
      expect(() =>
        repository.transaction(
          // the async callback is the input under test, not a mistake
          // eslint-disable-next-line @typescript-eslint/require-await
          async () => {
            repository.addNew({ name: "second" });
          },
        ),
      ).toThrow("Transaction function cannot return a promise");

      expect(names()).toEqual([name]);
      expect(db.inTransaction).toBe(false);
    });

    test("a nested unit of work commits as a savepoint", () => {
      repository.transaction(() => {
        repository.addNew({ name: "second" });
        repository.transaction(() => {
          repository.addNew({ name: "third" });
        });

        expect(db.inTransaction).toBe(true);
        expect(names()).toEqual([name, "second", "third"]);
      });

      expect(db.inTransaction).toBe(false);
    });

    test("a failed nested unit of work keeps the outer one", () => {
      repository.transaction(() => {
        repository.addNew({ name: "second" });

        expect(() =>
          repository.transaction(() => {
            repository.addNew({ name: "third" });
            throw new Error("inner failed");
          }),
        ).toThrow("inner failed");
      });

      expect(names()).toEqual([name, "second"]);
    });

    test("a failure in the outer unit discards the nested work too", () => {
      expect(() =>
        repository.transaction(() => {
          repository.transaction(() => {
            repository.addNew({ name: "second" });
          });
          throw new Error("outer failed");
        }),
      ).toThrow("outer failed");

      expect(names()).toEqual([name]);
      expect(db.inTransaction).toBe(false);
    });
  });
});
