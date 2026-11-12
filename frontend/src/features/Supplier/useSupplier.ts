import { createEntityHook } from "@/lib/useEntity";

import SupplierApi from "./Supplier.api";

const api = new SupplierApi();

export const SupplierQueryKey = "supplier";

const useSupplierEntity = createEntityHook({
  queryKey: SupplierQueryKey,
  api,
  create: api.create,
});

export default function useSupplier() {
  const { activeRows, ...entity } = useSupplierEntity();

  return { ...entity, suppliers: activeRows };
}
