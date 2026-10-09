import { useMutation, useQuery } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";

import MaterialTypeApi from "./MaterialType.api";

import type { MaterialTypePatchDTO } from "./MaterialType.model";

const api = new MaterialTypeApi();

export const MaterialTypeQueryKey = "material-type";

export default function useMaterialType() {
  const query = useQuery({
    queryKey: [MaterialTypeQueryKey],
    queryFn: api.getAll,
    retry: retryApiError,
  });
  const addMutation = useMutation({
    mutationFn: (name: string) => api.create({ name }),
    onSuccess: () => query.refetch(),
  });
  const updateMutation = useMutation({
    mutationFn: (value: MaterialTypePatchDTO & { id: number }) =>
      api.update(value, value.id),
    onSuccess: () => query.refetch(),
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => query.refetch(),
  });
  const restoreMutation = useMutation({
    mutationFn: api.restore,
    onSuccess: () => query.refetch(),
  });
  return {
    query,
    addMutation,
    updateMutation,
    removeMutation,
    restoreMutation,
  };
}
