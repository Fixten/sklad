import Api from "@/api";

import type {
  SupplyDTO,
  SupplyListQuery,
  SupplyPatchDTO,
} from "./Supply.model";

export default class SupplyApi {
  private api = new Api("/api/supply");
  private stockApi = new Api("/api/supply/stock/{id}");

  getAll = (params?: SupplyListQuery) => {
    return this.api.getAll(params);
  };

  get = (id: number) => {
    return this.api.get(id);
  };

  getStock = (materialVariantId: number) => {
    return this.stockApi.get(materialVariantId);
  };

  create = (value: SupplyDTO) => {
    return this.api.post(value);
  };

  update = (value: SupplyPatchDTO, id: number) => {
    return this.api.patch(value, id);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };

  restore = (id: number) => {
    return this.api.restore(id);
  };
}
