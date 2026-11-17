import { useQuery } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";
import { useApiMutations, useFeatureData } from "@/lib/useFeature";

import SupplyApi from "./Supply.api";
import type { SupplyListQuery } from "./Supply.model";

const api = new SupplyApi();

const queryKey = ["supply"];

export default function useSupplyData(params: SupplyListQuery) {
  return useFeatureData(
    [
      ...queryKey,
      ...[params.material_variant_id, params.supplier_id].filter(Boolean),
    ],
    () => api.getAll(params),
  );
}

export type SupplyData = ReturnType<typeof useSupplyData>;

export function useSupplyMutations() {
  return useApiMutations(queryKey, api);
}

export function useSupplyStock(materialVariantId: number) {
  return useQuery({
    queryKey: [queryKey, "stock", materialVariantId],
    queryFn: () => api.getStock(materialVariantId),
    retry: retryApiError,
  });
}
