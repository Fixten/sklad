import Api from "../../api";

import type { MaterialDTO } from "./Material.model";

export default class MaterialApi {
  private api = new Api("/api/material");

  getAll = () => {
    return this.api.getAll();
  };

  create = (value: MaterialDTO) => {
    return this.api.post(value);
  };

  update = (value: MaterialDTO, id: number) => {
    return this.api.patch(value, id);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };
}
