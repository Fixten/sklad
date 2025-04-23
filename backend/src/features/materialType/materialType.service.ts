import { NewMaterialType } from "./materialType.model.js";
import materialTypeRepository from "./materialType.repository.js";

import type { MaterialTypeRepositoryType } from "./materialType.repository.js";

export class MaterialTypeService {
  #repository: MaterialTypeRepositoryType;
  constructor(repository: MaterialTypeRepositoryType) {
    this.#repository = repository;
  }
  async addNew(materialType: NewMaterialType) {
    const current = await this.#repository.getByValue(materialType);
    if (current) throw new Error("This material type already exists");
    else return this.#repository.addNew(materialType);
  }
  delete(materialType: NewMaterialType) {
    return this.#repository.deleteByValue(materialType);
  }
  update(oldValue: NewMaterialType, newValue: NewMaterialType) {
    return this.#repository.updateByValue(oldValue, newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new MaterialTypeService(materialTypeRepository);
