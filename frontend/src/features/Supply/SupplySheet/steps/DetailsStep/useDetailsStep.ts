import useSupplier from "@/features/Supplier/useSupplier";
import useSupply from "@/features/Supply/useSupply";
import { sameName } from "@/lib/text/text";

import { supplyWizard } from "../../supplyWizard";

import type { DetailsDraft } from "./detailsForm";
import type { SupplierOption } from "./SupplierPicker";
import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

export function useDetailsStep(row: MaterialCatalogRow) {
  const wizard = supplyWizard.useWizard();
  const supply = useSupply();
  const supplier = useSupplier();

  const suppliers: SupplierOption[] = (supplier.query.data ?? []).map(
    ({ id, name }) => ({
      id,
      name,
    }),
  );

  const resolveSupplierId = async (
    supplierName: string,
    supplierId: number | null,
  ) => {
    if (supplierId !== null) return supplierId;

    const existing = suppliers.find((option) =>
      sameName(option.name, supplierName),
    );

    if (existing) return existing.id;

    const created = await supplier.addMutation.mutateAsync({
      name: supplierName,
    });

    return created.id;
  };

  const save = async (draft: DetailsDraft) => {
    await wizard.complete(async () => {
      const supplierId = await resolveSupplierId(
        draft.supplierName,
        draft.supplierId,
      );

      await supply.addMutation.mutateAsync({
        material_variant_id: row.variantId,
        quantity: draft.quantity,
        purchase_price: draft.purchasePrice,
        supplier_id: supplierId,
        description: draft.description,
        url: draft.url,
      });
    });
  };

  return { suppliers, save, pending: wizard.pending };
}
