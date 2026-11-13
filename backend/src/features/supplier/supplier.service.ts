import { ErrorMessages } from "@/constants/Errors.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { isSameName } from "@/utils/isSameName.js";

import SupplyService from "../supply/supply.service.js";

import SupplierRepository from "./supplier.repository.js";

import type { SupplierSchema } from "./supplier.schema.js";

export interface SupplierCreateInput {
  name: string;
  description?: string;
  url?: string;
  contact?: string;
}

export type SupplierUpdateInput = Partial<SupplierCreateInput>;

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
    return this.repository.getAllActive();
  }

  create(supplier: SupplierCreateInput) {
    this.assertNameIsFree(supplier.name);
    return this.repository.create({
      name: supplier.name,
      description: supplier.description ?? null,
      url: supplier.url ?? null,
      contact: supplier.contact ?? null,
    });
  }

  update(id: number, input: SupplierUpdateInput) {
    const current = this.repository.getById(id);
    if (current.deleted_at) {
      const name = input.name;
      if (name === undefined || Object.keys(input).length !== 1)
        throw new Error(ErrorMessages.ITEM_DELETED);
      this.assertNameIsFree(name, current.id);
      return this.repository.update(id, { name });
    }
    if (input.name !== undefined) this.assertNameIsFree(input.name, current.id);
    return this.repository.update(id, input);
  }

  delete(id: number) {
    const supplies = this.supply.getAllBySupplier(id);
    if (supplies.length > 0) {
      this.repository.softDelete(id);
      return "softDelete";
    }
    this.repository.hardDelete(id);
    return "hardDelete";
  }

  restore(id: number): SupplierSchema {
    const current = this.repository.getById(id);
    return this.repository.restore(current.id);
  }

  private assertNameIsFree(name: string, excludeId?: number) {
    const rows = this.repository.getAll();
    const conflict = rows.find(
      (row) => row.id !== excludeId && isSameName(row.name, name),
    );
    if (conflict?.deleted_at)
      throw new Error(ErrorMessages.NAME_RESERVED_BY_HIDDEN);
    if (conflict) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
