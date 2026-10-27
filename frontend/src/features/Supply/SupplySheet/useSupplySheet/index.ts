import { useState } from "react";

import {
  queryMaterialRow,
  queryMaterialRowWithType,
} from "@/features/Material/materialUtils/materiaUtils";
import useMaterial from "@/features/Material/useMaterial";
import useMaterialsCatalog, {
  buildMaterialCatalogRow,
  type MaterialCatalogRow,
  type MaterialTarget,
} from "@/features/Material/useMaterialsCatalog";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useSupplier from "@/features/Supplier/useSupplier";
import useSupply from "@/features/Supply/useSupply";
import useVariant from "@/features/Variant/useVariant";
import { sameName } from "@/lib/text/text";
import { useSheetFlow } from "@/lib/useSheetFlow/useSheetFlow";

import {
  supplyBackStep,
  supplyInitialStep,
  SupplyStepKind,
} from "../supplySteps";

import { useDetailsForm } from "./useDetailsForm";

import type { SupplyStep } from "../supplySteps";
import type { MaterialDraft } from "./materialDraft";
import type { CreationTarget } from "@/features/Material/materialUtils/materiaUtils";
import type { SupplierOption } from "@/features/Supply/SupplySheet/SupplySheetBody/DetailsFields/SupplierPicker";
import type { Unit } from "@/features/units";

interface Props {
  onOpenChange: (open: boolean) => void;
}

export function useSupplySheet({ onOpenChange }: Props) {
  const catalog = useMaterialsCatalog();
  const material = useMaterial();
  const materialType = useMaterialType();
  const variant = useVariant();
  const supply = useSupply();
  const supplier = useSupplier();

  const { step, failure, go, reset, run } =
    useSheetFlow<SupplyStep>(supplyInitialStep);
  const [query, setQuery] = useState("");

  const detailsUnit =
    step.kind === SupplyStepKind.Details ? step.row.unit : "meters";
  const detailsForm = useDetailsForm(detailsUnit);

  const supplierOptions: SupplierOption[] = (supplier.query.data ?? []).map(
    ({ id, name }) => ({
      id,
      name,
    }),
  );

  const resetSession = () => {
    reset();
    setQuery("");
    detailsForm.reset();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetSession();
    onOpenChange(next);
  };

  const back = () => {
    detailsForm.clearErrors();
    go(supplyBackStep);
  };

  const selectVariant = (selected: MaterialCatalogRow) => {
    detailsForm.reset();
    go({ kind: SupplyStepKind.Details, row: selected });
  };

  const selectCreation = (target: CreationTarget) => {
    go(
      target.kind === "variant"
        ? { kind: SupplyStepKind.Variant, material: target.material }
        : { kind: SupplyStepKind.Material },
    );
  };

  const createVariant = async (
    materialTarget: MaterialTarget,
    name: string,
    unit: Unit,
  ) => {
    return run(async () => {
      const created = await variant.addMutation.mutateAsync({
        name,
        unit,
        material_id: materialTarget.id,
      });

      detailsForm.reset();

      return {
        kind: SupplyStepKind.Details,
        row: {
          variantId: created.id,
          variantName: created.name,
          unit: created.unit,
          material: materialTarget,
        },
      };
    });
  };

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

  const createMaterial = async (draft: MaterialDraft) => {
    return run(async () => {
      const typeId =
        draft.type.kind === "new"
          ? (await materialType.addMutation.mutateAsync(draft.type.name)).id
          : draft.type.id;
      const createdMaterial = await material.addMutation.mutateAsync({
        name: draft.materialName,
        material_type_id: typeId,
      });
      const createdVariant = await variant.addMutation.mutateAsync({
        name: draft.variantName,
        unit: draft.unit,
        material_id: createdMaterial.id,
      });

      detailsForm.reset();

      return {
        kind: SupplyStepKind.Details,
        row: buildMaterialCatalogRow(
          createdVariant,
          createdMaterial,
          draft.type.name,
        ),
      };
    });
  };

  const submitDetails = async (row: MaterialCatalogRow) => {
    return run(async (isCurrent) => {
      const payload = detailsForm.validate();

      if (!payload) return;

      const supplierId = await resolveSupplierId(
        payload.supplierName,
        payload.supplierId,
      );

      await supply.addMutation.mutateAsync({
        material_variant_id: row.variantId,
        quantity: payload.quantity,
        purchase_price: payload.purchasePrice,
        supplier_id: supplierId,
        description: payload.description,
        url: payload.url,
      });

      if (isCurrent()) handleOpenChange(false);
    });
  };

  return {
    step,
    failure,
    query,
    setQuery,
    matchedRows: queryMaterialRow(catalog.rows, query),
    creation: queryMaterialRowWithType(catalog.rows, query),
    supplierOptions,
    types: catalog.types,
    variantPending: variant.addMutation.isPending,
    materialPending:
      material.addMutation.isPending ||
      materialType.addMutation.isPending ||
      variant.addMutation.isPending,
    details: detailsForm.details,
    detailsErrors: detailsForm.errors,
    unitCost: detailsForm.unitCost,
    updateDetails: detailsForm.update,
    clearDetailsError: detailsForm.clearError,
    handleOpenChange,
    back,
    selectVariant,
    selectCreation,
    createVariant,
    createMaterial,
    submitDetails,
  };
}
