import Api from "@/api";

import type {
  MaterialDTO,
  MaterialListQuery,
  MaterialPatchDTO,
} from "./Material.model";

export default class MaterialApi {
  private api = new Api("/api/material");

  getAll = (params?: MaterialListQuery) => {
    return this.api.getAll(params);
  };

  create = (value: MaterialDTO) => {
    return this.api.post(value);
  };

  update = ({ dto, id }: { dto: MaterialPatchDTO; id: number }) => {
    return this.api.patch(dto, id);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };

  restore = (id: number) => {
    return this.api.restore(id);
  };
}
