import { ErrorMessages } from "@/constants/Errors.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { isSameName } from "@/utils/isSameName.js";

import { MaterialVariantService } from "../materialVariant/materialVariant.service.js";

import { MaterialRepository } from "./material.repository.js";
import { MaterialModel } from "./material.schema.js";

export class MaterialService {
  static getSingleton = createSingleton(
    () =>
      new MaterialService(
        MaterialRepository.getSingleton(),
        MaterialVariantService.getSingleton(),
      ),
  );
  constructor(
    private repository: MaterialRepository,
    private variantService: MaterialVariantService,
  ) {}

  delete(id: number) {
    const variants = this.variantService.getByMaterial(id);
    if (variants.length > 0) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }

  getAll({ includeHidden = false }: { includeHidden?: boolean } = {}) {
    return includeHidden
      ? this.repository.getAll()
      : this.repository.getAllActive();
  }
  get(id: number) {
    return this.repository.getById(id);
  }
  getByType(materialTypeId: number) {
    return this.repository.getByType(materialTypeId);
  }
  create(material: MaterialModel) {
    this.getType(material.material_type_id);
    this.assertNameIsFree(material.name, material.material_type_id);
    return this.repository.create(material);
  }
  update(id: number, newValue: Partial<MaterialModel>) {
    const current = this.repository.getById(id);
    if (current.deleted_at) {
      const name = newValue.name;
      if (name === undefined || Object.keys(newValue).length !== 1)
        throw new Error(ErrorMessages.ITEM_DELETED);
      this.assertNameIsFree(name, current.material_type_id, current.id);
      return this.repository.update(id, { name });
    }
    const materialTypeId =
      newValue.material_type_id ?? current.material_type_id;
    if (newValue.material_type_id !== undefined)
      this.getType(newValue.material_type_id);
    if (newValue.name !== undefined || newValue.material_type_id !== undefined)
      this.assertNameIsFree(
        newValue.name ?? current.name,
        materialTypeId,
        current.id,
      );
    return this.repository.update(id, newValue);
  }
  restore(id: number) {
    const current = this.repository.getById(id);
    return this.repository.restore(current.id);
  }

  private getType(materialTypeId: number) {
    const type = this.repository.getTypeReference(materialTypeId);
    if (!type) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    if (type.deleted_at) throw new Error(ErrorMessages.REFERENCED_ITEM_DELETED);
    return type;
  }

  private assertNameIsFree(
    name: string,
    materialTypeId: number,
    excludeId?: number,
  ) {
    const siblings = this.repository.getByType(materialTypeId);
    const conflict = siblings.find(
      (row) => row.id !== excludeId && isSameName(row.name, name),
    );
    if (conflict?.deleted_at)
      throw new Error(ErrorMessages.NAME_RESERVED_BY_HIDDEN);
    if (conflict) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
