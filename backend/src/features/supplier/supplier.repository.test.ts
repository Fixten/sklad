import { getTestDbWithMigrations } from "@/db/dbTestHelpers.js";

import SupplierRepository from "./supplier.repository.js";
import { supplierSchema } from "./supplier.schema.js";

import type { SupplierModel } from "./supplier.schema.js";
import type { TestDbWithMigrations } from "@/db/dbTestHelpers.js";

function supplier(name: string): SupplierModel {
  return { name, description: null, url: null, contact: null };
}

describe("SupplierRepository name index", () => {
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
    repository.create(supplier("Oak"));

    expect(() => repository.create(supplier("oak"))).toThrow(
      /UNIQUE constraint failed/,
    );
    expect(db.client.select().from(supplierSchema).all()).toHaveLength(1);
  });

  test("rejects a name held by a soft-deleted supplier", () => {
    const created = repository.create(supplier("Oak"));
    repository.softDelete(created.id);

    expect(() => repository.create(supplier("oak"))).toThrow(
      /UNIQUE constraint failed/,
    );
  });

  test("rejects a name that differs from an existing supplier only in whitespace", () => {
    repository.create(supplier("Oak"));

    expect(() => repository.create(supplier("  Oak  "))).toThrow(
      /UNIQUE constraint failed/,
    );
  });

  test("keeps Cyrillic names that differ in case apart at the index", () => {
    repository.create(supplier("Дуб"));

    expect(repository.create(supplier("дуб")).name).toBe("дуб");
  });
});
