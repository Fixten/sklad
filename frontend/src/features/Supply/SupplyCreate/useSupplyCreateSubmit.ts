import { useNavigate } from "react-router";

import { useSupplyMutations } from "@/features/Supply/useSupply";
import pathsRouter from "@/router/paths.router";
import { toastSuccess } from "@ui/Toast";

import type { SupplyDraft } from "./supplyForm";

const trimmedDetail = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed === "" ? undefined : trimmed;
};

export default function useSupplyCreateSubmit() {
  const navigate = useNavigate();
  const { addMutation: addSupply } = useSupplyMutations();

  const submit = async (draft: SupplyDraft) => {
    const dto = {
      material_variant_id: draft.variantId,
      supplier_id: draft.supplierId,
      quantity: draft.quantity,
      purchase_price: draft.purchasePrice,
      description: trimmedDetail(draft.description),
      url: trimmedDetail(draft.url),
    };

    await addSupply.mutateAsync(dto);
    toastSuccess("Поставка создана");
    void navigate(pathsRouter.material);
  };

  return { submit };
}
