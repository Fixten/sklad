import { ErrorMessages } from "@/constants/Errors.js";
import {
  assertPositiveQuantity,
  fromScaledQuantity,
  toScaledQuantity,
} from "@/features/materialVariant/utils/quantity.js";
import { createSingleton } from "@/utils/createSingleton.js";
import { integerToDecimal, scaledInteger } from "@/utils/decimal.js";
import { isSameName } from "@/utils/isSameName.js";

import { ProductTemplateRepository } from "./productTemplate.repository.js";

import type {
  TemplateMaterialInput,
  TemplateMaterialRead,
  VariantReference,
} from "./productTemplate.repository.js";
import type {
  ProductTemplateModel,
  ProductTemplateSchema,
} from "./productTemplate.schema.js";
import type {
  ProductTemplateCreate,
  ProductTemplatePatch,
} from "./productTemplate.zod.js";
import type { DecimalInput } from "@/utils/decimal.js";

export interface ProductTemplateRow {
  id: number;
  name: string;
  description: string | null;
  production_instructions: string | null;
  drawing_description: string | null;
  expected_production_work_hours: number | null;
  development_work_hours: number | null;
  materials: {
    material_variant_id: number;
    quantity: number;
  }[];
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}

export class ProductTemplateService {
  static getSingleton = createSingleton(
    () => new ProductTemplateService(ProductTemplateRepository.getSingleton()),
  );

  constructor(private repository: ProductTemplateRepository) {}

  private decorate(
    row: ProductTemplateSchema,
    materials?: TemplateMaterialRead[],
  ): ProductTemplateRow {
    const storedMaterials = materials ?? this.repository.getMaterials(row.id);
    return {
      ...row,
      expected_production_work_hours:
        row.expected_production_work_hours === null
          ? null
          : integerToDecimal(row.expected_production_work_hours, 3),
      development_work_hours:
        row.development_work_hours === null
          ? null
          : integerToDecimal(row.development_work_hours, 3),
      materials: storedMaterials.map((material) => ({
        material_variant_id: material.material_variant_id,
        quantity: fromScaledQuantity(material.default_quantity, material.unit),
      })),
    };
  }

  getAll({ includeHidden = false }: { includeHidden?: boolean } = {}) {
    const rows = includeHidden
      ? this.repository.getAll()
      : this.repository.getAllActive();
    const materials = this.repository.getMaterialsFor(
      rows.map((row) => row.id),
    );
    return rows.map((row) => this.decorate(row, materials.get(row.id) ?? []));
  }

  get(id: number): ProductTemplateRow {
    return this.decorate(this.repository.getById(id));
  }

  create(input: ProductTemplateCreate): ProductTemplateRow {
    this.assertNameIsFree(input.name);
    const materials = this.prepareMaterials(input.materials);
    const created = this.repository.createWithMaterials(
      {
        name: input.name,
        description: input.description ?? null,
        production_instructions: input.production_instructions ?? null,
        drawing_description: input.drawing_description ?? null,
        expected_production_work_hours: this.toHours(
          input.expected_production_work_hours,
        ),
        development_work_hours: this.toHours(input.development_work_hours),
      },
      materials,
    );
    return this.decorate(created);
  }

  update(id: number, input: ProductTemplatePatch): ProductTemplateRow {
    const current = this.repository.getById(id);
    if (current.deleted_at) {
      const name = input.name;
      if (name === undefined || Object.keys(input).length !== 1)
        throw new Error(ErrorMessages.ITEM_DELETED);
      this.assertNameIsFree(name, current.id);
      return this.decorate(
        this.repository.updateWithMaterials(current.id, { name }),
      );
    }

    const changes: Partial<ProductTemplateModel> = {};
    if (input.name !== undefined) {
      this.assertNameIsFree(input.name, current.id);
      changes.name = input.name;
    }
    if (input.description !== undefined)
      changes.description = input.description;
    if (input.production_instructions !== undefined)
      changes.production_instructions = input.production_instructions;
    if (input.drawing_description !== undefined)
      changes.drawing_description = input.drawing_description;
    if (input.expected_production_work_hours !== undefined)
      changes.expected_production_work_hours = this.toHours(
        input.expected_production_work_hours,
      );
    if (input.development_work_hours !== undefined)
      changes.development_work_hours = this.toHours(
        input.development_work_hours,
      );

    const materials =
      input.materials === undefined
        ? undefined
        : this.prepareMaterials(input.materials);
    return this.decorate(
      this.repository.updateWithMaterials(id, changes, materials),
    );
  }

  delete(id: number) {
    this.repository.getById(id);
    if (this.repository.hasProductItems(id))
      return this.repository.softDelete(id);
    return this.repository.hardDelete(id);
  }

  restore(id: number): ProductTemplateRow {
    this.repository.getById(id);
    return this.decorate(this.repository.restore(id));
  }

  private prepareMaterials(
    materials: ProductTemplateCreate["materials"],
  ): TemplateMaterialInput[] {
    const seen = new Set<number>();
    return (materials ?? []).map((material) => {
      if (seen.has(material.material_variant_id))
        throw new Error(ErrorMessages.VARIANT_ALREADY_IN_TEMPLATE);
      seen.add(material.material_variant_id);
      const variant = this.getVariant(material.material_variant_id);
      const quantity = toScaledQuantity(material.quantity, variant.unit);
      assertPositiveQuantity(quantity);
      return {
        material_variant_id: variant.id,
        default_quantity: quantity,
      };
    });
  }

  private getVariant(id: number): VariantReference {
    const variant = this.repository.getVariantReference(id);
    if (!variant) throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    if (variant.deleted_at)
      throw new Error(ErrorMessages.REFERENCED_ITEM_DELETED);
    return variant;
  }

  private toHours(value: DecimalInput | null | undefined): number | null {
    if (value === undefined || value === null) return null;
    const hours = scaledInteger(value, 3, "reject");
    if (hours < 0) throw new Error(ErrorMessages.HOURS_NEGATIVE);
    return hours;
  }

  private assertNameIsFree(name: string, excludeId?: number) {
    const conflict = this.repository
      .getAll()
      .find((row) => row.id !== excludeId && isSameName(row.name, name));
    if (conflict?.deleted_at)
      throw new Error(ErrorMessages.NAME_RESERVED_BY_HIDDEN);
    if (conflict) throw new Error(ErrorMessages.NAME_ALREADY_EXISTS);
  }
}
