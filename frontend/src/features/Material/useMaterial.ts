import { createEntityHook } from "@/lib/useEntity";

import MaterialApi from "./Material.api";

const api = new MaterialApi();

export const MaterialQueryKey = "material";

const useMaterialEntity = createEntityHook({
  queryKey: MaterialQueryKey,
  api,
  create: api.create,
});

export default function useMaterial(options?: { hidden?: boolean }) {
  const { rows, ...entity } = useMaterialEntity(options);

  return { ...entity, materials: rows };
}
