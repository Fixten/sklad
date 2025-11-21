import Api from "../../../api";

import type { MaterialTypeModel } from "./MaterialType.model";

const path = "/material-type";

export default class MaterialTypeApi {
  #api: Api<MaterialTypeModel>;
  constructor() {
    this.#api = new Api(path);
  }

  get = (id: string) => {
    return this.#api.get(id);
  };

  getAll = () => {
    return this.#api.getAll();
  };

  create = (value: MaterialTypeModel) => {
    return this.#api.post<MaterialTypeModel>(value);
  };

  remove = (id: string) => {
    return this.#api.remove(id);
  };
}
