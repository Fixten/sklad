import { MaterialQueryKey } from "@/features/Material/useMaterial";
import { createEntityHook } from "@/lib/useEntity";

import VariantApi from "./Variant.api";
import type { VariantPatchDTO } from "./Variant.model";

const api = new VariantApi();

export const VariantQueryKey = "material-variant";

const useVariantEntity = createEntityHook({
  queryKey: VariantQueryKey,
  api,
  create: api.create,
  invalidate: [MaterialQueryKey],
  toPatch: (value: VariantPatchDTO & { id: number }) => ({
    name: value.name,
    unit: value.unit,
    material_id: value.material_id,
  }),
});

export default function useVariant() {
  const { activeRows, ...entity } = useVariantEntity();

  return { ...entity, variants: activeRows };
}
