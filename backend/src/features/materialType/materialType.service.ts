import { MaterialTypeModel } from "./materialType.model.js";
import materialTypeRepository from "./materialType.repository.js";

import type { MaterialTypeRepositoryType } from "./materialType.repository.js";

export class MaterialTypeService {
  #repository: MaterialTypeRepositoryType;
  constructor(repository: MaterialTypeRepositoryType) {
    this.#repository = repository;
  }
  async addNew(materialType: MaterialTypeModel) {
    const current = await this.#repository.getByValue(materialType);
    if (current) throw new Error("This material type already exists");
    else return this.#repository.addNew(materialType);
  }
  delete(materialType: MaterialTypeModel) {
    return this.#repository.deleteByValue(materialType);
  }
  update(oldValue: MaterialTypeModel, newValue: MaterialTypeModel) {
    return this.#repository.updateByValue(oldValue, newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new MaterialTypeService(materialTypeRepository);
