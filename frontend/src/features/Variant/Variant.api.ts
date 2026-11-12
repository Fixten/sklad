import Api from "@/api";

import type {
  VariantDTO,
  VariantListQuery,
  VariantPatchDTO,
} from "./Variant.model";

export default class VariantApi {
  private api = new Api("/api/material-variant");

  get = (id: number) => {
    return this.api.get(id);
  };

  getAll = (params?: VariantListQuery) => {
    return this.api.getAll(params);
  };

  create = (value: VariantDTO) => {
    return this.api.post(value);
  };

  update = (value: VariantPatchDTO, id: number) => {
    return this.api.patch(value, id);
  };

  remove = (variantId: number) => {
    return this.api.remove(variantId);
  };

  restore = (variantId: number) => {
    return this.api.restore(variantId);
  };
}
