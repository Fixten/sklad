import { useEffect, useState } from "react";

import useSupplier from "@/features/Supplier/useSupplier";
import useSupply from "@/features/Supply/useSupply";
import { sameName } from "@/lib/text/text";

import { useSupplySheetContext } from "../../context";

import { emptyDetails, parseDetails, unitCostPreview } from "./detailsForm";

import type { DetailsErrors, DetailsForm } from "./detailsForm";
import type { SupplierOption } from "./SupplierPicker";
import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

export function useDetailsStep(row: MaterialCatalogRow) {
  const { close, run, registerSubmitDetails } = useSupplySheetContext();
  const supply = useSupply();
  const supplier = useSupplier();

  const [details, setDetails] = useState<DetailsForm>(emptyDetails);
  const [errors, setErrors] = useState<DetailsErrors>({});

  const supplierOptions: SupplierOption[] = (supplier.query.data ?? []).map(
    ({ id, name }) => ({
      id,
      name,
    }),
  );

  const update = (patch: Partial<DetailsForm>) => {
    setDetails((current) => ({ ...current, ...patch }));
  };

  const clearError = (key: keyof DetailsErrors) => {
    setErrors((current) => {
      if (!current[key]) return current;

      return { ...current, [key]: undefined };
    });
  };

  useEffect(() => {
    const resolveSupplierId = async (
      supplierName: string,
      supplierId: number | null,
    ) => {
      if (supplierId !== null) return supplierId;

      const existing = supplierOptions.find((option) =>
        sameName(option.name, supplierName),
      );

      if (existing) return existing.id;

      const created = await supplier.addMutation.mutateAsync({
        name: supplierName,
      });

      return created.id;
    };

    const submit = async () => {
      await run(async (isCurrent) => {
        const parsed = parseDetails(details);

        if (!parsed.payload) {
          setErrors(parsed.errors);
          return;
        }

        const supplierId = await resolveSupplierId(
          parsed.payload.supplierName,
          parsed.payload.supplierId,
        );

        await supply.addMutation.mutateAsync({
          material_variant_id: row.variantId,
          quantity: parsed.payload.quantity,
          purchase_price: parsed.payload.purchasePrice,
          supplier_id: supplierId,
          description: parsed.payload.description,
          url: parsed.payload.url,
        });

        if (isCurrent()) close();
      });
    };

    registerSubmitDetails(submit);

    return () => {
      registerSubmitDetails(undefined);
    };
  }, [
    close,
    details,
    registerSubmitDetails,
    row.variantId,
    run,
    supplier,
    supplierOptions,
    supply,
  ]);

  return {
    details,
    errors,
    suppliers: supplierOptions,
    unitCost: unitCostPreview(details, row.unit),
    update,
    clearError,
  };
}
