import { createSingleton } from "@/utils/createSingleton.js";

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
    return this.repository.create(materialType);
  }
  async delete(id: number) {
    const materials = await this.materialService.getByType(id);
    if (materials.length > 0) return this.repository.softDelete(id);
    else return this.repository.hardDelete(id);
  }
  update(id: number, newValue: Partial<MaterialTypeModel>) {
    return this.repository.update(id, newValue);
  }
  getAll() {
    return this.repository.getAllActive();
  }
  get(id: number) {
    return this.repository.getById(id);
  }
}