import { ErrorMessages } from "@/constants/Errors.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { isSameName } from "@/utils/isSameName.js";

import SupplyService from "../supply/supply.service.js";

import { MaterialVariantRepository } from "./materialVariant.repository.js";
import { MaterialVariantModel } from "./materialVariant.schema.js";

export class MaterialVariantService {
  static getSingleton = createSingleton(
    () =>
      new MaterialVariantService(
        SupplyService.getSingleton(),
        MaterialVariantRepository.getSingleton(),
      ),
  );
  constructor(
    private supplyService: SupplyService,
    private repository: MaterialVariantRepository,
  ) {}

  async createVariant(variant: MaterialVariantModel) {
    await this.assertNameIsFree(variant.name, variant.material_id);
    return this.repository.create(variant);
  }

  async updateVariant(id: number, value: Partial<MaterialVariantModel>) {
    const current = await this.getEditable(id);
    if (value.unit !== undefined)
      await this.assertUnitChangeAllowed(id, current.unit, value.unit);
    if (value.name !== undefined || value.material_id !== undefined)
      await this.assertNameIsFree(
        value.name ?? current.name,
        value.material_id ?? current.material_id,
        current.id,
      );
    return this.repository.update(id, value);
  }

  async delete(id: number) {
    const supplies = await this.supplyService.getAllByVariant(id);
    if (supplies.length > 0) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }

  async restore(id: number) {
    const current = await this.repository.getById(id);
    await this.assertNameIsFree(current.name, current.material_id, current.id);
    return this.repository.restore(id);
  }

  getAll() {
    return this.repository.getAllActive();
  }
  get(id: number) {
    return this.repository.getById(id);
  }
  getByMaterial(materialId: number) {
    return this.repository.getByMaterial(materialId);
  }

  private async getEditable(id: number) {
    const current = await this.repository.getById(id);
    if (current.deleted_at) throw new Error(ErrorMessages.ITEM_DELETED);
    return current;
  }

  private async assertUnitChangeAllowed(
    id: number,
    currentUnit: string,
    nextUnit: string,
  ) {
    if (currentUnit === nextUnit) return;
    const supplies = await this.supplyService.getAllByVariant(id);
    if (supplies.length > 0)
      throw new Error(ErrorMessages.UNIT_CHANGE_AFTER_USAGE);
  }

  private async assertNameIsFree(
    name: string,
    materialId: number,
    excludeId?: number,
  ) {
    const siblings = await this.repository.getActiveByMaterial(materialId);
    const taken = siblings.some(
      (row) => row.id !== excludeId && isSameName(row.name, name),
    );
    if (taken) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
