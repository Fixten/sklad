import Api from "@/api";

import type {
  MaterialTypeDTO,
  MaterialTypeListQuery,
  MaterialTypePatchDTO,
} from "./MaterialType.model";

export default class MaterialTypeApi {
  private api = new Api("/api/material-type");

  get = (id: number) => {
    return this.api.get(id);
  };

  getAll = (params?: MaterialTypeListQuery) => {
    return this.api.getAll(params);
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
