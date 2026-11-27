import { ErrorMessages } from "@/constants/Errors.js";

import { ProductTemplateRepository } from "./productTemplate.repository.js";
import { ProductTemplateSchema } from "./productTemplate.schema.js";
import { ProductTemplateService } from "./productTemplate.service.js";
import { TemplateMaterialSchema } from "./templateMaterial.schema.js";

import type { TemplateMaterialRead } from "./productTemplate.repository.js";

jest.mock("./productTemplate.repository.js");

function row(
  overrides: Partial<ProductTemplateSchema> = {},
): ProductTemplateSchema {
  return {
    id: 1,
    name: "Shelf",
    description: null,
    production_instructions: null,
    drawing_description: null,
    expected_production_work_hours: null,
    development_work_hours: null,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    updated_at: null,
    deleted_at: null,
    ...overrides,
  };
}

function material(
  overrides: Partial<TemplateMaterialRead> = {},
): TemplateMaterialRead {
  const stored: TemplateMaterialSchema = {
    id: 1,
    product_template_id: 1,
    material_variant_id: 10,
    default_quantity: 1250,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    updated_at: null,
    deleted_at: null,
    ...overrides,
  };
  return { ...stored, unit: overrides.unit ?? "meters" };
}

function variant(id: number, unit: "pieces" | "meters" = "pieces") {
  return { id, unit, deleted_at: null } as const;
}

describe("ProductTemplateService", () => {
  let repository: jest.Mocked<ProductTemplateRepository>;
  let service: ProductTemplateService;

  beforeEach(() => {
    repository =
      new ProductTemplateRepository() as jest.Mocked<ProductTemplateRepository>;
    repository.getAll.mockReturnValue([]);
    repository.getById.mockReturnValue(row());
    repository.getVariantReference.mockImplementation((id) =>
      id === 999 ? undefined : variant(id),
    );
    repository.getMaterials.mockReturnValue([]);
    repository.getMaterialsFor.mockReturnValue(new Map());
    repository.createWithMaterials.mockImplementation((value) =>
      row({ ...value, id: 1 }),
    );
    repository.updateWithMaterials.mockImplementation((id, value) =>
      row({ ...value, id }),
    );
    repository.softDelete.mockReturnValue(row({ deleted_at: new Date() }));
    repository.hardDelete.mockReturnValue(true);
    repository.restore.mockReturnValue(row());
    service = new ProductTemplateService(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("reads", () => {
    test("decorates hours and material quantities as decimals", () => {
      repository.getById.mockReturnValue(
        row({
          expected_production_work_hours: 1250,
          development_work_hours: 0,
        }),
      );
      repository.getMaterials.mockReturnValue([
        material(),
        material({
          id: 2,
          material_variant_id: 11,
          default_quantity: 4,
          unit: "pieces",
        }),
      ]);

      expect(service.get(1)).toEqual(
        expect.objectContaining({
          expected_production_work_hours: 1.25,
          development_work_hours: 0,
          materials: [
            { material_variant_id: 10, quantity: 1.25 },
            { material_variant_id: 11, quantity: 4 },
          ],
        }),
      );
    });

    test("lists active rows by default and groups their materials", () => {
      repository.getAllActive.mockReturnValue([
        row({ expected_production_work_hours: 2000 }),
      ]);
      repository.getMaterialsFor.mockReturnValue(new Map([[1, [material()]]]));

      expect(service.getAll()[0]).toEqual(
        expect.objectContaining({
          expected_production_work_hours: 2,
          materials: [{ material_variant_id: 10, quantity: 1.25 }],
        }),
      );
      expect(repository.getAll).not.toHaveBeenCalled();
    });

    test("includes hidden rows when requested", () => {
      repository.getAll.mockReturnValue([
        row({ id: 2, deleted_at: new Date() }),
      ]);

      expect(service.getAll({ includeHidden: true })).toHaveLength(1);
      expect(repository.getAllActive).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    test("normalizes nullable fields, hours and material quantities before one write", () => {
      repository.getVariantReference.mockImplementation((id) =>
        variant(id, id === 11 ? "meters" : "pieces"),
      );

      const created = service.create({
        name: "  Shelf  ",
        expected_production_work_hours: "1.250",
        development_work_hours: 0,
        materials: [
          { material_variant_id: 10, quantity: 4 },
          { material_variant_id: 11, quantity: "1.250" },
        ],
      });

      expect(repository.createWithMaterials).toHaveBeenCalledTimes(1);
      expect(repository.createWithMaterials).toHaveBeenCalledWith(
        {
          name: "  Shelf  ",
          description: null,
          production_instructions: null,
          drawing_description: null,
          expected_production_work_hours: 1250,
          development_work_hours: 0,
        },
        [
          { material_variant_id: 10, default_quantity: 4 },
          { material_variant_id: 11, default_quantity: 1250 },
        ],
      );
      expect(created.materials).toEqual([]);
    });

    test("allows omitted hours and materials", () => {
      service.create({ name: "Shelf" });

      expect(repository.createWithMaterials).toHaveBeenCalledWith(
        expect.objectContaining({
          expected_production_work_hours: null,
          development_work_hours: null,
        }),
        [],
      );
    });

    test("allows null hours", () => {
      service.create({
        name: "Shelf",
        expected_production_work_hours: null,
        development_work_hours: null,
      });

      expect(repository.createWithMaterials).toHaveBeenCalledWith(
        expect.objectContaining({
          expected_production_work_hours: null,
          development_work_hours: null,
        }),
        [],
      );
    });

    test("rejects an active name conflict, including case and whitespace", () => {
      repository.getAll.mockReturnValue([row({ id: 2, name: " shelf " })]);

      expect(() => service.create({ name: "SHELF" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects a name reserved by a hidden template", () => {
      repository.getAll.mockReturnValue([
        row({ id: 2, name: "Shelf", deleted_at: new Date() }),
      ]);

      expect(() => service.create({ name: "shelf" })).toThrow(
        ErrorMessages.NAME_RESERVED_BY_HIDDEN,
      );
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects an unknown variant without writing", () => {
      repository.getVariantReference.mockReturnValue(undefined);

      expect(() =>
        service.create({
          name: "Shelf",
          materials: [{ material_variant_id: 999, quantity: 1 }],
        }),
      ).toThrow(ErrorMessages.ITEM_NOT_FOUND);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects a hidden variant without writing", () => {
      repository.getVariantReference.mockReturnValue({
        ...variant(10),
        deleted_at: new Date(),
      });

      expect(() =>
        service.create({
          name: "Shelf",
          materials: [{ material_variant_id: 10, quantity: 1 }],
        }),
      ).toThrow(ErrorMessages.REFERENCED_ITEM_DELETED);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects duplicate variants without writing", () => {
      expect(() =>
        service.create({
          name: "Shelf",
          materials: [
            { material_variant_id: 10, quantity: 1 },
            { material_variant_id: 10, quantity: 2 },
          ],
        }),
      ).toThrow(ErrorMessages.VARIANT_ALREADY_IN_TEMPLATE);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test.each([0, -1])(
      "rejects non-positive quantity %s without writing",
      (quantity) => {
        expect(() =>
          service.create({
            name: "Shelf",
            materials: [{ material_variant_id: 10, quantity }],
          }),
        ).toThrow(ErrorMessages.QUANTITY_NOT_POSITIVE);
        expect(repository.createWithMaterials).not.toHaveBeenCalled();
      },
    );

    test("rejects fractional pieces without writing", () => {
      expect(() =>
        service.create({
          name: "Shelf",
          materials: [{ material_variant_id: 10, quantity: 1.5 }],
        }),
      ).toThrow(ErrorMessages.INVALID_DECIMAL_PRECISION);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects meter quantities beyond three decimals without writing", () => {
      repository.getVariantReference.mockReturnValue(variant(10, "meters"));

      expect(() =>
        service.create({
          name: "Shelf",
          materials: [{ material_variant_id: 10, quantity: "1.2500" }],
        }),
      ).toThrow(ErrorMessages.INVALID_DECIMAL_PRECISION);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects hours beyond three decimals without writing", () => {
      expect(() =>
        service.create({ name: "Shelf", development_work_hours: "1.0001" }),
      ).toThrow(ErrorMessages.INVALID_DECIMAL_PRECISION);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects negative hours without writing", () => {
      expect(() =>
        service.create({ name: "Shelf", expected_production_work_hours: -1 }),
      ).toThrow(ErrorMessages.HOURS_NEGATIVE);
      expect(repository.createWithMaterials).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    test("leaves materials absent and patches only supplied fields", () => {
      service.update(1, { description: "Oak" });

      expect(repository.updateWithMaterials).toHaveBeenCalledWith(
        1,
        { description: "Oak" },
        undefined,
      );
    });

    test("treats an empty materials array as replace with none", () => {
      service.update(1, { materials: [] });

      expect(repository.updateWithMaterials).toHaveBeenCalledWith(1, {}, []);
    });

    test("replaces all materials when supplied", () => {
      repository.getVariantReference.mockImplementation((id) =>
        variant(id, id === 11 ? "meters" : "pieces"),
      );

      service.update(1, {
        expected_production_work_hours: "2.500",
        materials: [
          { material_variant_id: 10, quantity: 4 },
          { material_variant_id: 11, quantity: "1.250" },
        ],
      });

      expect(repository.updateWithMaterials).toHaveBeenCalledWith(
        1,
        { expected_production_work_hours: 2500 },
        [
          { material_variant_id: 10, default_quantity: 4 },
          { material_variant_id: 11, default_quantity: 1250 },
        ],
      );
    });

    test("clears hours when null is supplied", () => {
      service.update(1, { development_work_hours: null });

      expect(repository.updateWithMaterials).toHaveBeenCalledWith(
        1,
        { development_work_hours: null },
        undefined,
      );
    });

    test("rejects a name conflict without writing", () => {
      repository.getAll.mockReturnValue([row({ id: 2, name: "Other" })]);

      expect(() => service.update(1, { name: "other" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repository.updateWithMaterials).not.toHaveBeenCalled();
    });

    test("rejects a hidden name conflict without writing", () => {
      repository.getAll.mockReturnValue([
        row({ id: 2, name: "Other", deleted_at: new Date() }),
      ]);

      expect(() => service.update(1, { name: "other" })).toThrow(
        ErrorMessages.NAME_RESERVED_BY_HIDDEN,
      );
      expect(repository.updateWithMaterials).not.toHaveBeenCalled();
    });

    test("allows the current row to keep its own name", () => {
      repository.getAll.mockReturnValue([row({ name: " shelf " })]);

      service.update(1, { name: "SHELF" });

      expect(repository.updateWithMaterials).toHaveBeenCalled();
    });

    test.each([
      {
        input: { materials: [{ material_variant_id: 999, quantity: 1 }] },
        message: ErrorMessages.ITEM_NOT_FOUND,
      },
      {
        input: { materials: [{ material_variant_id: 10, quantity: 0 }] },
        message: ErrorMessages.QUANTITY_NOT_POSITIVE,
      },
      {
        input: { expected_production_work_hours: -1 },
        message: ErrorMessages.HOURS_NEGATIVE,
      },
    ])(
      "does not write when replacement validation fails",
      ({ input, message }) => {
        expect(() => service.update(1, input)).toThrow(message);
        expect(repository.updateWithMaterials).not.toHaveBeenCalled();
      },
    );

    test("renames a hidden template with a name-only patch", () => {
      repository.getById.mockReturnValue(row({ deleted_at: new Date() }));
      repository.getAll.mockReturnValue([]);

      service.update(1, { name: "Renamed" });

      expect(repository.updateWithMaterials).toHaveBeenCalledWith(1, {
        name: "Renamed",
      });
    });

    test.each([
      {},
      { description: "late edit" },
      { name: "Renamed", materials: [] },
    ])("rejects every non-name-only patch on a hidden template", (input) => {
      repository.getById.mockReturnValue(row({ deleted_at: new Date() }));

      expect(() => service.update(1, input)).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repository.updateWithMaterials).not.toHaveBeenCalled();
    });

    test("propagates not found without writing", () => {
      repository.getById.mockImplementation(() => {
        throw new Error(ErrorMessages.ITEM_NOT_FOUND);
      });

      expect(() => service.update(999, { name: "Missing" })).toThrow(
        ErrorMessages.ITEM_NOT_FOUND,
      );
      expect(repository.updateWithMaterials).not.toHaveBeenCalled();
    });
  });

  describe("delete and restore", () => {
    test("soft deletes when product items reference the template", () => {
      repository.hasProductItems.mockReturnValue(true);

      service.delete(1);

      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(repository.hardDelete).not.toHaveBeenCalled();
    });

    test("hard deletes when no product items reference the template", () => {
      repository.hasProductItems.mockReturnValue(false);

      service.delete(1);

      expect(repository.hardDelete).toHaveBeenCalledWith(1);
      expect(repository.softDelete).not.toHaveBeenCalled();
    });

    test("does not delete an unknown template", () => {
      repository.getById.mockImplementation(() => {
        throw new Error(ErrorMessages.ITEM_NOT_FOUND);
      });

      expect(() => service.delete(999)).toThrow(ErrorMessages.ITEM_NOT_FOUND);
      expect(repository.softDelete).not.toHaveBeenCalled();
      expect(repository.hardDelete).not.toHaveBeenCalled();
    });

    test("restores without checking name availability", () => {
      repository.getById.mockReturnValue(row({ deleted_at: new Date() }));

      const restored = service.restore(1);

      expect(repository.restore).toHaveBeenCalledWith(1);
      expect(repository.getAll).not.toHaveBeenCalled();
      expect(restored.deleted_at).toBeNull();
    });

    test("returns not found when restoring an unknown template", () => {
      repository.getById.mockImplementation(() => {
        throw new Error(ErrorMessages.ITEM_NOT_FOUND);
      });

      expect(() => service.restore(999)).toThrow(ErrorMessages.ITEM_NOT_FOUND);
      expect(repository.restore).not.toHaveBeenCalled();
    });
  });
});
