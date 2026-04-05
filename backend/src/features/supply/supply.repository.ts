import { eq } from "drizzle-orm";

import Repository from "@/db/repository.js";

import { SupplyModel, supplySchema } from "./supply.schema.js";

export class SupplyRepository {
  private baseRepository;
  schema = supplySchema;

  constructor() {
    this.baseRepository = new Repository(this.schema);
  }

  getById(id: number) {
    return this.baseRepository.getById(id);
  }
  getAll() {
    return this.baseRepository.getAll();
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

  deteleAllForVariant(variantId: number) {
    return this.baseRepository.deleteByValue(
      eq(this.schema.variant, variantId),
    );
  }
}

export default new SupplyRepository();
