import { useMutation, useQuery } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";

import SupplierApi from "./Supplier.api";

import type { SupplierPatchDTO } from "./Supplier.model";

const api = new SupplierApi();

export const SupplierQueryKey = "supplier";

export default function useSupplier() {
  const query = useQuery({
    queryKey: [SupplierQueryKey],
    queryFn: api.getAll,
    retry: retryApiError,
  });
  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => query.refetch(),
  });
  const updateMutation = useMutation({
    mutationFn: (value: SupplierPatchDTO & { id: number }) =>
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
