import { createSingleton } from "@/utils/createSingeton.js";
import { SupplierModel } from "./supplier.schema.js";
import SupplierRepository from "./supplier.repository.js";
import SupplyService from "../supply/supply.service.js";

export default class SupplierService {
  static getSingleton = createSingleton(
    () =>
      new SupplierService(
        SupplierRepository.getSingleton(),
        SupplyService.getSingleton(),
      ),
  );
  constructor(
    private repository: SupplierRepository,
    private supply: SupplyService,
  ) {}

  getById(id: number) {
    return this.repository.getById(id);
  }
  getAll() {
    return this.repository.getAll();
  }

  addNew(supply: SupplierModel) {
    return this.repository.addNew(supply);
  }
  update(id: number, newValue: SupplierModel) {
    return this.repository.update(id, newValue);
  }

  async delete(id: number) {
    const supplies = await this.supply.getForSupplier(id);
    if (supplies.length > 0) {
      await this.repository.softDelete(id);
      return "softDelete";
    } else {
      await this.repository.delete(id);
      return "hardDelete";
    }
  }
}
