import { useMutation, useQuery } from "@tanstack/react-query";

import MaterialTypeApi from "./MaterialType.api";

const api = new MaterialTypeApi();

export default function userMaterialType() {
  const query = useQuery({
    queryKey: ["material-type"],
    queryFn: api.getAll,
  });
  const addMutation = useMutation({
    mutationFn: (name: string) => api.create({ name }),
    onSuccess: () => query.refetch(),
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => query.refetch(),
  });
  return { query, addMutation, removeMutation };
}
