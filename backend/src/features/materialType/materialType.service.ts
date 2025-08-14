import { ObjectId } from "mongodb";

import { MaterialTypeModel } from "./materialType.model.js";
import materialTypeRepository from "./materialType.repository.js";

import type { MaterialTypeRepositoryType } from "./materialType.repository.js";

export class MaterialTypeService {
  #repository: MaterialTypeRepositoryType;
  constructor(repository: MaterialTypeRepositoryType) {
    this.#repository = repository;
  }
  addNew(materialType: MaterialTypeModel) {
    return this.#repository.addNew(materialType);
  }
  delete(id: string) {
    return this.#repository.deleteById(new ObjectId(id));
  }
  update(id: string, newValue: MaterialTypeModel) {
    return this.#repository.updateById(new ObjectId(id), newValue);
  }
  getAll() {
    return this.#repository.getAll();
  }
}

export default new MaterialTypeService(materialTypeRepository);
