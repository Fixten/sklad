import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { SupplierModel, supplierSchema } from "./supplier.schema.js";

export default class SupplierRepository {
  static getSingleton = createSingleton(() => new SupplierRepository());
  private baseRepository;
  private schema = supplierSchema;

  constructor() {
    this.baseRepository = new Repository(this.schema);
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }

  create(supplier: SupplierModel) {
    return this.baseRepository.addNew(supplier);
  }
  update(id: number, newValue: SupplierModel) {
    return this.baseRepository.updateById(id, newValue);
  }

  hardDelete(id: number) {
    return this.baseRepository.deleteById(id);
  }

  getAllActive() {
    return this.baseRepository.getAllActive();
  }

  softDelete(id: number) {
    return this.baseRepository.softDelete(id);
  }
}
