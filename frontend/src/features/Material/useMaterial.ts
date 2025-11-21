import { useMutation, useQuery } from "@tanstack/react-query";

import { ApiModel } from "@/api/api.model";
import { MaterialDTO } from "@/features/Material/Material.model";

import MaterialApi from "./Material.api";

const api = new MaterialApi();

export const MaterialQueryKey = "material";

export default function useMaterial() {
  const query = useQuery({
    queryKey: [MaterialQueryKey],
    queryFn: api.getAll,
  });
  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => query.refetch(),
  });
  const updateMutation = useMutation({
    mutationFn: (material: MaterialDTO & Pick<ApiModel, "_id">) =>
      api.update(material, material._id),
    onSuccess: () => query.refetch(),
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => query.refetch(),
  });
  return { query, addMutation, updateMutation, removeMutation };
}
