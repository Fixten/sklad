import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MaterialQueryKey } from "../useMaterial";

import VariantApi from "./Variant.api";

const api = new VariantApi();

export default function useVariant() {
  const queryClient = useQueryClient();

  const invalidateMaterial = () =>
    queryClient.invalidateQueries({ queryKey: [MaterialQueryKey] });

  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: invalidateMaterial,
  });
  //   const updateMutation = useMutation({
  //     mutationFn: (material: MaterialDTO & Pick<ApiModel, "_id">) =>
  //       api.update(material, material._id),
  //     onSuccess: invalidateMaterial,
  //   });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: invalidateMaterial,
  });
  return { addMutation, removeMutation };
}
