import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";

import { MaterialQueryKey } from "../Material/useMaterial";

import VariantApi from "./Variant.api";
import { VariantModel } from "./Variant.model";

const api = new VariantApi();

export const VariantQueryKey = "material-variant";

export default function useVariant() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [VariantQueryKey],
    queryFn: api.getAll,
    retry: retryApiError,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: [MaterialQueryKey] });
    void queryClient.invalidateQueries({ queryKey: [VariantQueryKey] });
  };

  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: (variant: VariantModel) => api.update(variant, variant.id),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: invalidate,
  });
  const restoreMutation = useMutation({
    mutationFn: api.restore,
    onSuccess: invalidate,
  });
  return {
    query,
    addMutation,
    removeMutation,
    updateMutation,
    restoreMutation,
  };
}
