import { createEntityHook } from "@/lib/useEntity";

import MaterialTypeApi from "./MaterialType.api";

const api = new MaterialTypeApi();

export const MaterialTypeQueryKey = "material-type";

const useMaterialTypeEntity = createEntityHook({
  queryKey: MaterialTypeQueryKey,
  api,
  create: (name: string) => api.create({ name }),
});

export default function useMaterialType(options?: { hidden?: boolean }) {
  const { rows, ...entity } = useMaterialTypeEntity(options);

  return { ...entity, types: rows };
}
