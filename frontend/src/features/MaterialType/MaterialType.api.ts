import Api from "../../api";

import type {
  MaterialTypeDTO,
  MaterialTypePatchDTO,
} from "./MaterialType.model";

export default class MaterialTypeApi {
  private api = new Api("/api/material-type");

  get = (id: number) => {
    return this.api.get(id);
  };

  getAll = () => {
    return this.api.getAll();
  };

  create = (value: MaterialTypeDTO) => {
    return this.api.post(value);
  };

  update = (value: MaterialTypePatchDTO, id: number) => {
    return this.api.patch(value, id);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };

  restore = (id: number) => {
    return this.api.restore(id);
  };
}
