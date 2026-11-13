import type {
  MaterialDTO,
  MaterialModel,
} from "@/features/Material/Material.model";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import type {
  SupplierDTO,
  SupplierModel,
} from "@/features/Supplier/Supplier.model";
import type { SupplyDTO } from "@/features/Supply/Supply.model";
import type {
  VariantDTO,
  VariantModel,
} from "@/features/Variant/Variant.model";
import { sameName } from "@/lib/text/text";

import type { SupplyDraft, TargetDraft } from "./supplyForm";

export interface SupplyCatalog {
  types: Pick<MaterialTypeModel, "id" | "name">[];
  materials: Pick<MaterialModel, "id" | "name" | "material_type_id">[];
  variants: Pick<VariantModel, "id" | "name" | "unit" | "material_id">[];
}

export interface SupplyResolutionDeps {
  catalog: SupplyCatalog;
  suppliers: Pick<SupplierModel, "id" | "name">[];
  createType: (name: string) => Promise<Pick<MaterialTypeModel, "id">>;
  createMaterial: (value: MaterialDTO) => Promise<Pick<MaterialModel, "id">>;
  createVariant: (value: VariantDTO) => Promise<Pick<VariantModel, "id">>;
  createSupplier: (value: SupplierDTO) => Promise<Pick<SupplierModel, "id">>;
}

const trimmedDetail = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();

  return trimmed === "" ? undefined : trimmed;
};

const createVariantId = async (
  deps: SupplyResolutionDeps,
  target: TargetDraft,
  type: Pick<MaterialTypeModel, "id"> | undefined,
  material: Pick<MaterialModel, "id"> | undefined,
): Promise<number> => {
  const typeId = type?.id ?? (await deps.createType(target.typeName)).id;
  const materialId =
    material?.id ??
    (
      await deps.createMaterial({
        name: target.materialName,
        material_type_id: typeId,
      })
    ).id;

  return (
    await deps.createVariant({
      name: target.variantName,
      unit: target.unit,
      material_id: materialId,
    })
  ).id;
};

const resolveSupplierId = async (
  deps: SupplyResolutionDeps,
  name: string,
): Promise<number> => {
  const supplier = deps.suppliers.find((row) => sameName(row.name, name));

  return supplier?.id ?? (await deps.createSupplier({ name })).id;
};

export const resolveSupplyDto = async (
  deps: SupplyResolutionDeps,
  draft: SupplyDraft,
): Promise<SupplyDTO> => {
  const target: TargetDraft = {
    typeName: draft.target.typeName.trim(),
    materialName: draft.target.materialName.trim(),
    variantName: draft.target.variantName.trim(),
    unit: draft.target.unit,
  };

  const type = deps.catalog.types.find((row) =>
    sameName(row.name, target.typeName),
  );
  const material = deps.catalog.materials.find(
    (row) =>
      sameName(row.name, target.materialName) &&
      row.material_type_id === type?.id,
  );
  const variant = deps.catalog.variants.find(
    (row) =>
      sameName(row.name, target.variantName) &&
      row.material_id === material?.id,
  );

  const materialVariantId =
    variant?.id ?? (await createVariantId(deps, target, type, material));
  const supplierName = draft.supplierName.trim();
  const supplierId =
    supplierName === ""
      ? undefined
      : await resolveSupplierId(deps, supplierName);

  return {
    material_variant_id: materialVariantId,
    supplier_id: supplierId,
    quantity: draft.quantity,
    purchase_price: draft.purchasePrice,
    description: trimmedDetail(draft.description),
    url: trimmedDetail(draft.url),
  };
};
