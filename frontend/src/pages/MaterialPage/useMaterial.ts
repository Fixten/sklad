import { useMutation, useQuery } from "@tanstack/react-query";
import MaterialApi from "../../features/Material/Material.api";

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
    mutationFn: api.create,
    onSuccess: () => query.refetch(),
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => query.refetch(),
  });
  return { query, addMutation, updateMutation, removeMutation };
}
