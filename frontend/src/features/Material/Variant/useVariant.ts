import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResponseBody } from "@/api";

import { MaterialQueryKey } from "../useMaterial";

import VariantApi from "./Variant.api";
import { Variant } from "./Variant.model";

const api = new VariantApi();

export default function useVariant() {
  const queryClient = useQueryClient();

  const invalidateMaterial = () =>
    queryClient.invalidateQueries({ queryKey: [MaterialQueryKey] });

  const addMutation = useMutation({
    mutationFn: api.create,
    onSuccess: invalidateMaterial,
  });
  const updateMutation = useMutation({
    mutationFn: (variant: ResponseBody<Variant>) =>
      api.update(variant, variant.id),
    onSuccess: invalidateMaterial,
  });
  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: invalidateMaterial,
  });
  return { addMutation, removeMutation, updateMutation };
}
