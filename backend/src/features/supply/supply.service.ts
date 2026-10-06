import { ErrorMessages } from "@/constants/Errors.js";
import {
  assertPositiveQuantity,
  fromScaledQuantity,
  toScaledQuantity,
} from "@/features/materialVariant/utils/quantity.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { DecimalInput } from "@/utils/decimal.js";
import {
  kopecksToRub,
  rubToKopecks,
  unitPurchaseCostRub,
} from "@/utils/money.js";

import {
  SupplyFilter,
  SupplyRepository,
  SupplyView,
} from "./supply.repository.js";
import { SupplyModel } from "./supply.schema.js";

import type { MaterialUnit } from "@/features/materialVariant/utils/quantity.js";

export interface SupplyCreateInput {
  description?: string;
  purchase_price: DecimalInput;
  quantity: DecimalInput;
  url?: string;
  material_variant_id: number;
  supplier_id?: number;
}

export type SupplyUpdateInput = Partial<SupplyCreateInput>;

export interface SupplyRow {
  id: number;
  description: string | null;
  purchase_price: number;
  quantity: number;
  unit: MaterialUnit;
  remaining_quantity: number;
  unit_purchase_cost: number;
  url: string | null;
  material_variant_id: number;
  supplier_id: number | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export interface SupplyStock {
  material_variant_id: number;
  unit: MaterialUnit;
  quantity: number;
}

function toRow(view: SupplyView): SupplyRow {
  return {
    id: view.id,
    description: view.description,
    purchase_price: kopecksToRub(view.purchase_price),
    quantity: fromScaledQuantity(view.quantity, view.unit),
    unit: view.unit,
    remaining_quantity: fromScaledQuantity(
      view.quantity - view.consumed_quantity,
      view.unit,
    ),
    unit_purchase_cost: unitPurchaseCostRub(
      view.purchase_price,
      view.quantity,
      view.unit,
    ),
    url: view.url,
    material_variant_id: view.material_variant_id,
    supplier_id: view.supplier_id,
    created_at: view.created_at,
    updated_at: view.updated_at,
    deleted_at: view.deleted_at,
  };
}

export default class SupplyService {
  static getSingleton = createSingleton(
    () => new SupplyService(SupplyRepository.getSingleton()),
  );

  constructor(private repository: SupplyRepository) {}

  getAll(filter: SupplyFilter = {}): SupplyRow[] {
    const views = this.repository.getFilteredViews(filter);
    return views.map(toRow);
  }

  get(id: number): SupplyRow {
    return toRow(this.repository.requireViewById(id));
  }

  private requireVariant(id: number) {
    const variant = this.repository.getVariantReference(id);
    if (!variant) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    return variant;
  }

  private getVariant(id: number) {
    const variant = this.requireVariant(id);
    if (variant.deleted_at)
      throw new Error(ErrorMessages.REFERENCED_ITEM_DELETED);
    return variant;
  }

  getStock(materialVariantId: number): SupplyStock {
    const variant = this.requireVariant(materialVariantId);
    const views = this.repository.getFilteredViews({
      material_variant_id: materialVariantId,
    });
    const remaining = views.reduce(
      (total, view) => total + view.quantity - view.consumed_quantity,
      0,
    );
    return {
      material_variant_id: materialVariantId,
      unit: variant.unit,
      quantity: fromScaledQuantity(remaining, variant.unit),
    };
  }

  create(input: SupplyCreateInput): SupplyRow {
    const variant = this.getVariant(input.material_variant_id);
    const supplierId = this.resolveSupplierId(input.supplier_id);
    const quantity = toScaledQuantity(input.quantity, variant.unit);
    assertPositiveQuantity(quantity);
    const purchasePrice = rubToKopecks(input.purchase_price);
    const created = this.repository.create({
      description: input.description ?? null,
      purchase_price: purchasePrice,
      quantity,
      url: input.url ?? null,
      material_variant_id: variant.id,
      supplier_id: supplierId,
    });
    return toRow({ ...created, unit: variant.unit, consumed_quantity: 0 });
  }

  private assertVariantMoveAllowed(
    current: SupplyView,
    materialVariantId: number,
  ) {
    if (current.consumed_quantity > 0)
      throw new Error(ErrorMessages.VARIANT_CHANGE_AFTER_USAGE);
    return this.getVariant(materialVariantId);
  }

  /**
   * The business decision behind a patch: what to write, given the row as it
   * stands. `SupplyRepository.updateAtomically` runs this inside its
   * transaction, so the variant and supplier reads below join that unit of work.
   */
  private changesFor(
    current: SupplyView,
    input: SupplyUpdateInput,
  ): Partial<SupplyModel> {
    if (current.deleted_at) throw new Error(ErrorMessages.ITEM_DELETED);

    const changes: Partial<SupplyModel> = {};

    const unit =
      input.material_variant_id === undefined
        ? current.unit
        : this.assertVariantMoveAllowed(current, input.material_variant_id)
            .unit;

    if (unit !== current.unit && input.quantity === undefined)
      throw new Error(ErrorMessages.QUANTITY_REQUIRED_FOR_UNIT_CHANGE);

    if (input.material_variant_id !== undefined)
      changes.material_variant_id = input.material_variant_id;

    if (input.quantity !== undefined) {
      const quantity = toScaledQuantity(input.quantity, unit);
      assertPositiveQuantity(quantity);
      if (quantity < current.consumed_quantity)
        throw new Error(ErrorMessages.QUANTITY_BELOW_CONSUMED);
      changes.quantity = quantity;
    }
    if (input.purchase_price !== undefined)
      changes.purchase_price = rubToKopecks(input.purchase_price);
    if (input.description !== undefined)
      changes.description = input.description;
    if (input.url !== undefined) changes.url = input.url;
    if (
      input.supplier_id !== undefined &&
      input.supplier_id !== current.supplier_id
    )
      changes.supplier_id = this.resolveSupplierId(input.supplier_id);

    return changes;
  }

  update(id: number, input: SupplyUpdateInput): SupplyRow {
    return toRow(
      this.repository.updateAtomically(id, (current) =>
        this.changesFor(current, input),
      ),
    );
  }

  delete(id: number) {
    if (this.repository.hasConsumptions(id))
      return this.repository.softDelete(id);
    return this.repository.hardDelete(id);
  }

  restore(id: number): SupplyRow {
    this.repository.requireViewById(id);
    this.repository.restore(id);
    return this.get(id);
  }

  getAllByVariant(materialVariantId: number) {
    return this.repository.getAllByVariant(materialVariantId);
  }

  getAllBySupplier(supplierId: number) {
    return this.repository.getAllBySupplier(supplierId);
  }

  private resolveSupplierId(supplierId: number | undefined): number | null {
    if (supplierId === undefined) return null;
    const supplier = this.repository.getSupplierReference(supplierId);
    if (!supplier) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    return supplier.id;
  }
}
