import Api from "@/api";

import type { VariantDTO, VariantPatchDTO } from "./Variant.model";

export default class VariantApi {
  private api = new Api("/api/material-variant");

  get = (id: number) => {
    return this.api.get(id);
  };

  getAll = () => {
    return this.api.getAll();
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
