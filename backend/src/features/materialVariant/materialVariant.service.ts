import { ErrorMessages } from "@/constants/Errors.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { isSameName } from "@/utils/isSameName.js";

import SupplyService from "../supply/supply.service.js";

import { MaterialVariantRepository } from "./materialVariant.repository.js";
import {
  MaterialVariantModel,
  MaterialVariantSchema,
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

  private decorate(row: MaterialVariantSchema) {
    return {
      ...row,
      unit_locked:
        this.supplyService.getAllByVariant(row.id).length > 0 ||
        this.repository.hasUsage(row.id),
    };
  }

  createVariant(variant: MaterialVariantModel) {
    this.getMaterial(variant.material_id);
    this.assertNameIsFree(variant.name, variant.material_id);
    return this.decorate(this.repository.create(variant));
  }

  updateVariant(id: number, value: Partial<MaterialVariantModel>) {
    const current = this.getEditable(id);
    if (value.unit !== undefined)
      this.assertUnitChangeAllowed(id, current.unit, value.unit);
    if (value.material_id !== undefined) this.getMaterial(value.material_id);
    if (value.name !== undefined || value.material_id !== undefined)
      this.assertNameIsFree(
        value.name ?? current.name,
        value.material_id ?? current.material_id,
        current.id,
      );
    return this.decorate(this.repository.update(id, value));
  }

  delete(id: number) {
    const referenced =
      this.supplyService.getAllByVariant(id).length > 0 ||
      this.repository.hasUsage(id);
    if (referenced) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }

  restore(id: number) {
    const current = this.repository.getById(id);
    this.assertNameIsFree(current.name, current.material_id, current.id);
    return this.decorate(this.repository.restore(id));
  }

  getAll({ includeHidden = false }: { includeHidden?: boolean } = {}) {
    return includeHidden
      ? this.repository.getAll()
      : this.repository.getAllActive();
  }
  get(id: number) {
    return this.decorate(this.repository.getById(id));
  }
  getByMaterial(materialId: number) {
    return this.repository.getByMaterial(materialId);
  }

  private getEditable(id: number) {
    const current = this.repository.getById(id);
    if (current.deleted_at) throw new Error(ErrorMessages.ITEM_DELETED);
    return current;
  }

  private getMaterial(materialId: number) {
    const material = this.repository.getMaterialReference(materialId);
    if (!material) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    if (material.deleted_at)
      throw new Error(ErrorMessages.REFERENCED_ITEM_DELETED);
    return material;
  }

  private assertUnitChangeAllowed(
    id: number,
    currentUnit: string,
    nextUnit: string,
  ) {
    if (currentUnit === nextUnit) return;
    const supplies = this.supplyService.getAllByVariant(id);
    if (supplies.length > 0 || this.repository.hasUsage(id))
      throw new Error(ErrorMessages.UNIT_CHANGE_AFTER_USAGE);
  }

  private assertNameIsFree(
    name: string,
    materialId: number,
    excludeId?: number,
  ) {
    const siblings = this.repository.getActiveByMaterial(materialId);
    const taken = siblings.some(
      (row) => row.id !== excludeId && isSameName(row.name, name),
    );
    if (taken) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
