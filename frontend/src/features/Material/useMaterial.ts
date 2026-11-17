import { useApiMutations, useFeatureData } from "@/lib/useFeature";

import MaterialApi from "./Material.api";

const api = new MaterialApi();

const queryKey = ["material"];

export default function useMaterialData() {
  return useFeatureData(queryKey, () => api.getAll({ hidden: "true" }));
}
export type MaterialssData = ReturnType<typeof useMaterialData>;

export function useMaterialMutations() {
  return useApiMutations(queryKey, api);
}
