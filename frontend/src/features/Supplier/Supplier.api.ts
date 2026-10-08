import Api from "@/api";

import type { SupplierDTO, SupplierPatchDTO } from "./Supplier.model";

export default class SupplierApi {
  private api = new Api("/api/supplier");

  get = (id: number) => {
    return this.api.get(id);
  };

  getAll = () => {
    return this.api.getAll();
  };

  create = (value: SupplierDTO) => {
    return this.api.post(value);
  };

  update = (value: SupplierPatchDTO, id: number) => {
    return this.api.patch(value, id);
  };

  remove = (id: number) => {
    return this.api.remove(id);
  };

  restore = (id: number) => {
    return this.api.restore(id);
  };
}
