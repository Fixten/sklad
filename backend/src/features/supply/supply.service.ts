import { createSingleton } from "@/utils/createSingleton.js";

import { SupplyRepository } from "./supply.repository.js";
import { SupplyModel } from "./supply.schema.js";

export default class SupplyService {
  static getSingleton = createSingleton(
    () => new SupplyService(SupplyRepository.getSingleton()),
  );

  constructor(private repository: SupplyRepository) {}

  getById(id: number) {
    return this.repository.getById(id);
  }
  getAll() {
    return this.repository.getAll();
  }
  getAllByVariant(variantId: number) {
    return this.repository.getAllByVariant(variantId);
  }
  getAllBySupplier(supplierId: number) {
    return this.repository.getAllBySupplier(supplierId);
  }
  create(supply: SupplyModel) {
    return this.repository.create(supply);
  }
  update(id: number, newValue: SupplyModel) {
    return this.repository.update(id, newValue);
  }
  hardDelete(id: number) {
    return this.repository.hardDelete(id);
  }
}
