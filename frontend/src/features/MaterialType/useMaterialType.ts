import { useApiMutations, useFeatureData } from "@/lib/useFeature";

import MaterialTypeApi from "./MaterialType.api";

const api = new MaterialTypeApi();

const queryKey = ["material-type"];

export default function useMaterialTypeData() {
  return useFeatureData(queryKey, () => api.getAll({ hidden: "true" }));
}
export type MaterialTypesData = ReturnType<typeof useMaterialTypeData>;

export function useMaterialTypesMutations() {
  return useApiMutations(queryKey, api);
}

export type MaterialTypesMutations = ReturnType<
  typeof useMaterialTypesMutations
>;
