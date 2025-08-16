import { ObjectId } from "mongodb";

import Repository from "@/db/repository.js";

import { MaterialTypeModel } from "./materialType.model.js";

const collectionName = "material-type";

class MaterialTypeRepository {
  #repository: Repository<MaterialTypeModel>;
  constructor() {
    this.#repository = new Repository(collectionName);
  }
  addNew(materialType: MaterialTypeModel) {
    return this.#repository.addNew(materialType);
  }
  delete(id: string) {
    return this.#repository.deleteById(new ObjectId(id));
  }
  update(id: string, newValue: MaterialTypeModel) {
    return this.#repository.updateById(new ObjectId(id), { $set: newValue });
  }
  getAll() {
    return this.#repository.getAll();
  }
  get(id: string) {
    return this.#repository.getById(new ObjectId(id));
  }
}

export default MaterialTypeRepository;
