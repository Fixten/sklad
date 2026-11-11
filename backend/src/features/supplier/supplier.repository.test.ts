import { getTestDbWithMigrations } from "@/db/dbTestHelpers.js";

import SupplierRepository from "./supplier.repository.js";
import { supplierSchema } from "./supplier.schema.js";

import type { TestDbWithMigrations } from "@/db/dbTestHelpers.js";

describe("SupplierRepository", () => {
  let db: TestDbWithMigrations;
  let repository: SupplierRepository;

  beforeEach(() => {
    db = getTestDbWithMigrations();
    repository = new SupplierRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  test("rejects a name that differs from an active supplier only in case", () => {
    repository.create({
      name: "Oak",
      description: null,
      url: null,
      contact: null,
    });

    expect(() =>
      repository.create({
        name: "oak",
        description: null,
        url: null,
        contact: null,
      }),
    ).toThrow(/UNIQUE constraint failed/);
    expect(db.client.select().from(supplierSchema).all()).toHaveLength(1);
  });
});
