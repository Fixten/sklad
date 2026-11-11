import { useQuery } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";
import { MaterialQueryKey } from "@/features/Material/useMaterial";
import { VariantQueryKey } from "@/features/Variant/useVariant";
import { createEntityHook } from "@/lib/useEntity";

import SupplyApi from "./Supply.api";
import type { SupplyListQuery } from "./Supply.model";

const api = new SupplyApi();

export const SupplyQueryKey = "supply";

const useSupplyEntity = createEntityHook({
  queryKey: SupplyQueryKey,
  api,
  create: api.create,
  invalidate: [VariantQueryKey, MaterialQueryKey],
});

export default function useSupply() {
  const { rows, ...entity } = useSupplyEntity();

  return { ...entity, supplies: rows };
}

export function useSupplyList(params?: SupplyListQuery) {
  return useQuery({
    queryKey: [SupplyQueryKey, "list", params ?? {}],
    queryFn: () => api.getAll(params),
    retry: retryApiError,
  });
}

export function useSupplyStock(materialVariantId: number | null) {
  return useQuery({
    queryKey: [SupplyQueryKey, "stock", materialVariantId],
    queryFn: () => api.getStock(materialVariantId ?? 0),
    enabled: materialVariantId !== null,
    retry: retryApiError,
  });
}
