import { ErrorMessages } from "@/constants/Errors.js";
import { createSingleton } from "@/utils/createSingleton.js";

import SupplyService from "../supply/supply.service.js";

import { MaterialVariantRepository } from "./materialVariant.repository.js";
import {
  MATERIAL_VARIANT_UNITS,
  MaterialVariantModel,
  MaterialVariantUnit,
} from "./materialVariant.schema.js";

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
    this.validateUnit(variant.unit);
    return this.repository.create(variant);
  }

  async updateVariant(id: number, value: Partial<MaterialVariantModel>) {
    if (value.unit !== undefined) {
      this.validateUnit(value.unit);
      const current = await this.repository.getById(id);
      if (current.unit !== value.unit) {
        const supplies = await this.supplyService.getByVariant(id);
        if (supplies.length > 0)
          throw new Error(ErrorMessages.UNIT_CHANGE_AFTER_USAGE);
      }
    }
    return this.repository.update(id, value);
  }

  async deleteVariant(id: number) {
    const supplies = await this.supplyService.getByVariant(id);
    if (supplies.length > 0) {
      await this.repository.softDelete(id);
      return "softDelete";
    } else {
      await this.repository.hardDelete(id);
      return "hardDelete";
    }
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

  private validateUnit(unit: string) {
    if (!MATERIAL_VARIANT_UNITS.includes(unit as MaterialVariantUnit))
      throw new Error(ErrorMessages.WRONG_UNIT);
  }
}
