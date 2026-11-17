import { useApiMutations, useFeatureData } from "@/lib/useFeature";

import SupplierApi from "./Supplier.api";

const api = new SupplierApi();

const queryKey = ["supplier"];

export default function useSupplierData() {
  return useFeatureData(queryKey, () => api.getAll());
}

export type SuppliersData = ReturnType<typeof useSupplierData>;

export function useSupplierMutations() {
  return useApiMutations(queryKey, api);
}

export type SupplierMutations = ReturnType<typeof useSupplierMutations>;
