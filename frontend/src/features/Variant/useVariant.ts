import { useApiMutations, useFeatureData } from "@/lib/useFeature";

import VariantApi from "./Variant.api";

const api = new VariantApi();

const queryKey = ["material-variant"];

export default function useVariantData() {
  return useFeatureData(queryKey, () => api.getAll({ hidden: "true" }));
}
export type VariantsData = ReturnType<typeof useVariantData>;

export function useVariantMutations() {
  return useApiMutations(queryKey, api);
}
