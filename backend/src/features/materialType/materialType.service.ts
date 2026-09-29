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

  async create(materialType: MaterialTypeModel) {
    await this.assertNameIsFree(materialType.name);
    return this.repository.create(materialType);
  }
  async delete(id: number) {
    const materials = await this.materialService.getByType(id);
    if (materials.length > 0) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }
  async update(id: number, newValue: Partial<MaterialTypeModel>) {
    const current = await this.getEditable(id);
    if (newValue.name !== undefined)
      await this.assertNameIsFree(newValue.name, current.id);
    return this.repository.update(id, newValue);
  }
  async restore(id: number) {
    const current = await this.repository.getById(id);
    await this.assertNameIsFree(current.name, current.id);
    return this.repository.restore(id);
  }
  getAll() {
    return this.repository.getAllActive();
  }
  get(id: number) {
    return this.repository.getById(id);
  }

  private async getEditable(id: number) {
    const current = await this.repository.getById(id);
    if (current.deleted_at) throw new Error(ErrorMessages.ITEM_DELETED);
    return current;
  }
  private async assertNameIsFree(name: string, excludeId?: number) {
    const existing = await this.repository.getAllActive();
    const taken = existing.some(
      (row) => row.id !== excludeId && isSameName(row.name, name),
    );
    if (taken) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
