import Api from "../../api";

import type { MaterialDTO, MaterialModel } from "./Material.model";

const path = "material";

export default class MaterialApi {
  #api: Api<MaterialModel>;
  constructor() {
    this.#api = new Api(path);
  }

  getAll = async () => {
    return this.#api.getAll();
  };

  create = (value: MaterialDTO) => {
    return this.#api.post<MaterialModel>(value);
  };

  update = (value: MaterialDTO, id: string) => {
    return this.#api.post(value, id);
  };

  remove = (id: string) => {
    return this.#api.remove(id);
  };
}
