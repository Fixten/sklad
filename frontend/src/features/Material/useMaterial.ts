import { useMutation, useQuery } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";
import { MaterialDTO, MaterialModel } from "@/features/Material/Material.model";

import MaterialApi from "./Material.api";

const api = new MaterialApi();

export const MaterialQueryKey = "material";

export default function useMaterial() {
  const query = useQuery({
    queryKey: [MaterialQueryKey],
    queryFn: api.getAll,
    retry: retryApiError,
  });
  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => query.refetch(),
  });
  const updateMutation = useMutation({
    mutationFn: (material: MaterialDTO & Pick<MaterialModel, "id">) =>
      api.update(material, material.id),
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
