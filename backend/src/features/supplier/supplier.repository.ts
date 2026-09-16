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
  getAll() {
    return this.baseRepository.getAll();
  }

  addNew(supply: SupplierModel) {
    return this.baseRepository.addNew(supply);
  }
  update(id: number, newValue: SupplierModel) {
    return this.baseRepository.updateById(id, newValue);
  }

  delete(id: number) {
    return this.baseRepository.deleteById(id);
  }

  softDelete(id: number) {
    return this.baseRepository.updateById(id, { deleted: true });
  }
}
