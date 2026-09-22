import { eq } from "drizzle-orm";

import Repository from "@/db/repository.js";
import { createSingleton } from "@/utils/createSingleton.js";

import { SupplyModel, supplySchema } from "./supply.schema.js";

export class SupplyRepository {
  static getSingleton = createSingleton(() => new SupplyRepository());
  private baseRepository;
  private schema = supplySchema;

  constructor() {
    this.baseRepository = new Repository(this.schema);
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }
  getAll() {
    return this.baseRepository.getAll();
  }
  getByVariant(variantId: number) {
    return this.baseRepository.getByValue(eq(this.schema.variant, variantId));
  }

  getBySupplier(supplier: number) {
    return this.baseRepository.getByValue(eq(this.schema.supplier, supplier));
  }

  create(supply: SupplyModel) {
    return this.baseRepository.addNew(supply);
  }
  update(id: number, newValue: SupplyModel) {
    return this.baseRepository.updateById(id, newValue);
  }

  hardDelete(id: number) {
    return this.baseRepository.deleteById(id);
  }
}
