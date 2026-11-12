import { createEntityHook } from "@/lib/useEntity";

import MaterialApi from "./Material.api";

const api = new MaterialApi();

export const MaterialQueryKey = "material";

const useMaterialEntity = createEntityHook({
  queryKey: MaterialQueryKey,
  api,
  create: api.create,
});

export default function useMaterial() {
  const { activeRows, ...entity } = useMaterialEntity();

  return { ...entity, materials: activeRows };
}
