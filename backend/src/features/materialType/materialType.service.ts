import { ErrorMessages } from "@/constants/Errors.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { isSameName } from "@/utils/isSameName.js";

import { MaterialService } from "../material/material.service.js";

import MaterialTypeRepository from "./materialType.repository.js";
import { MaterialTypeModel } from "./materialType.schema.js";

export default class MaterialTypeService {
  static getSingleton = createSingleton(
    () =>
      new MaterialTypeService(
        MaterialTypeRepository.getSingleton(),
        MaterialService.getSingleton(),
      ),
  );

  constructor(
    private repository: MaterialTypeRepository,
    private materialService: MaterialService,
  ) {}

  create(materialType: MaterialTypeModel) {
    this.assertNameIsFree(materialType.name);
    return this.repository.create(materialType);
  }
  delete(id: number) {
    const materials = this.materialService.getByType(id);
    if (materials.length > 0) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }
  update(id: number, newValue: Partial<MaterialTypeModel>) {
    const current = this.getEditable(id);
    if (newValue.name !== undefined)
      this.assertNameIsFree(newValue.name, current.id);
    return this.repository.update(id, newValue);
  }
  restore(id: number) {
    const current = this.repository.getById(id);
    this.assertNameIsFree(current.name, current.id);
    return this.repository.restore(id);
  }
  getAll() {
    return this.repository.getAllActive();
  }
  get(id: number) {
    return this.repository.getById(id);
  }

  private getEditable(id: number) {
    const current = this.repository.getById(id);
    if (current.deleted_at) throw new Error(ErrorMessages.ITEM_DELETED);
    return current;
  }
  private assertNameIsFree(name: string, excludeId?: number) {
    const existing = this.repository.getAllActive();
    const taken = existing.some(
      (row) => row.id !== excludeId && isSameName(row.name, name),
    );
    if (taken) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
