import { eq } from "drizzle-orm";

import singleton from "@/db/index.js";
import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { supplierSchema } from "./supplier.schema.js";

import type { SupplierModel } from "./supplier.schema.js";
import type { Db } from "@/db/index.js";

export default class SupplierRepository {
  static getSingleton = createSingleton(() => new SupplierRepository());
  private baseRepository;
  private schema = supplierSchema;

  constructor(db: Db<Record<string, unknown>> = singleton) {
    this.baseRepository = new Repository(this.schema, db);
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }

  getAllActive() {
    return this.baseRepository.getAllActive();
  }

  create(supplier: SupplierModel) {
    return this.baseRepository.addNew(supplier);
  }

  update(id: number, newValue: Partial<SupplierModel>) {
    return this.baseRepository.updateById(id, newValue);
  }

  softDelete(id: number) {
    return this.baseRepository.softDelete(id);
  }

  hardDelete(id: number) {
    return this.baseRepository.deleteByValue(eq(this.schema.id, id));
  }

  restore(id: number) {
    return this.baseRepository.restore(id);
  }
}
