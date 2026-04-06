import { eq } from "drizzle-orm";

import Repository from "@/db/repository.js";

import { SupplyModel, supplySchema } from "./supply.schema.js";
import { createSingleton } from "@/utils/createSingeton.js";

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
  getForVariant(variantId: number) {
    return this.baseRepository.getByValue(eq(this.schema.variant, variantId));
  }

  getForSupplier(supplier: number) {
    return this.baseRepository.getByValue(eq(this.schema.supplier, supplier));
  }

  addNew(supply: SupplyModel) {
    return this.baseRepository.addNew(supply);
  }
  update(id: number, newValue: SupplyModel) {
    return this.baseRepository.updateById(id, newValue);
  }

  delete(id: number) {
    return this.baseRepository.deleteById(id);
  }
}
