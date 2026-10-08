import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";
import { MaterialQueryKey } from "@/features/Material/useMaterial";
import { VariantQueryKey } from "@/features/Material/Variant/useVariant";

import SupplyApi from "./Supply.api";

import type { SupplyListQuery, SupplyPatchDTO } from "./Supply.model";

const api = new SupplyApi();

export const SupplyQueryKey = "supply";

export default function useSupply() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [SupplyQueryKey],
    queryFn: () => api.getAll(),
    retry: retryApiError,
  });

  const invalidateStock = () => {
    void queryClient.invalidateQueries({ queryKey: [SupplyQueryKey] });
    void queryClient.invalidateQueries({ queryKey: [VariantQueryKey] });
    void queryClient.invalidateQueries({ queryKey: [MaterialQueryKey] });
  };

  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: invalidateStock,
  });
  const updateMutation = useMutation({
    mutationFn: (value: SupplyPatchDTO & { id: number }) =>
      api.update(value, value.id),
    onSuccess: invalidateStock,
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: invalidateStock,
  });
  const restoreMutation = useMutation({
    mutationFn: api.restore,
    onSuccess: invalidateStock,
  });
  return {
    query,
    addMutation,
    updateMutation,
    removeMutation,
    restoreMutation,
  };
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
