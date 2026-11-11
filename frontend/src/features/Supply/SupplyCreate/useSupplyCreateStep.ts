import { useNavigate } from "react-router";

import useMaterial from "@/features/Material/useMaterial";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useSupplier from "@/features/Supplier/useSupplier";
import useSupply from "@/features/Supply/useSupply";
import useVariant from "@/features/Variant/useVariant";
import pathsRouter from "@/router/paths.router";
import { toastSuccess } from "@ui/Toast";

import type { SupplyDraft } from "./supplyForm";
import { resolveSupplyDto } from "./supplyResolution";

export default function useSupplyCreateStep() {
  const navigate = useNavigate();
  const { types, addMutation: addType } = useMaterialType();
  const { materials, addMutation: addMaterial } = useMaterial();
  const { variants, addMutation: addVariant } = useVariant();
  const {
    suppliers,
    addMutation: addSupplier,
    query: supplierQuery,
  } = useSupplier();
  const { addMutation: addSupply } = useSupply();

  const submit = async (draft: SupplyDraft) => {
    const value = await resolveSupplyDto(
      {
        catalog: { types, materials, variants },
        suppliers,
        createType: (name) => addType.mutateAsync(name),
        createMaterial: (dto) => addMaterial.mutateAsync(dto),
        createVariant: (dto) => addVariant.mutateAsync(dto),
        createSupplier: (dto) => addSupplier.mutateAsync(dto),
        listFreshSuppliers: async () => {
          const result = await supplierQuery.refetch();

          return (result.data ?? []).filter((row) => !row.deleted_at);
        },
      },
      draft,
    );

    await addSupply.mutateAsync(value);
    toastSuccess("Поставка создана");
    void navigate(pathsRouter.material);
  };

  return { submit };
}
