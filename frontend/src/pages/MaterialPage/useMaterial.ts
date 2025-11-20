import { useMutation, useQuery } from "@tanstack/react-query";
import MaterialApi from "../../features/Material/Material.api";
import { ResponseBody } from "@/api";
import { MaterialDTO } from "@/features/Material/Material.model";
import { ApiModel } from "@/api/api.model";

const api = new MaterialApi();

export default function useMaterial() {
  const query = useQuery({
    queryKey: ["material"],
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
