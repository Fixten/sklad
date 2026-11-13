import { ErrorMessages } from "@/constants/Errors.js";

import { SupplySchema } from "../supply/supply.schema.js";
import SupplyService from "../supply/supply.service.js";

import { MaterialVariantRepository } from "./materialVariant.repository.js";
import { MaterialVariantSchema } from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";

jest.mock("../supply/supply.service.js");
jest.mock("./materialVariant.repository.js");

function row(
  overrides: Partial<MaterialVariantSchema> = {},
): MaterialVariantSchema {
  return {
    id: 1,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    name: "Oak plank",
    unit: "meters",
    material_id: 1,
    ...overrides,
  };
}

describe("VariantService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  let supplyService: jest.Mocked<SupplyService>;
  let repo: jest.Mocked<MaterialVariantRepository>;
  let service: MaterialVariantService;
  beforeEach(() => {
    supplyService = new SupplyService(
      {} as never,
    ) as unknown as jest.Mocked<SupplyService>;
    repo =
      new MaterialVariantRepository() as jest.Mocked<MaterialVariantRepository>;
    repo.getMaterialReference.mockReturnValue({ id: 1, deleted_at: null });
    repo.hasUsage.mockReturnValue(false);
    repo.create.mockReturnValue(row());
    repo.update.mockReturnValue(row());
    repo.restore.mockReturnValue(row());
    supplyService.getAllByVariant.mockReturnValue([]);
    service = new MaterialVariantService(supplyService, repo);
  });

  describe("getAll", () => {
    test("returns only active rows by default without unit_locked", () => {
      const active = [row()];
      repo.getAllActive.mockReturnValue(active);
      expect(service.getAll()).toEqual(active);
      expect(repo.getAll).not.toHaveBeenCalled();
    });

    test("returns active and soft-deleted rows with includeHidden without unit_locked", () => {
      const all = [row(), row({ id: 2, deleted_at: new Date() })];
      repo.getAll.mockReturnValue(all);
      expect(service.getAll({ includeHidden: true })).toEqual(all);
      expect(repo.getAllActive).not.toHaveBeenCalled();
    });
  });

  describe("unit_locked on single-row returns", () => {
    test("get marks locked when supplies exist", () => {
      const found = row();
      repo.getById.mockReturnValue(found);
      supplyService.getAllByVariant.mockReturnValue([{} as SupplySchema]);
      expect(service.get(1)).toEqual({ ...found, unit_locked: true });
    });

    test("get marks locked when a usage exists even without supplies", () => {
      const found = row();
      repo.getById.mockReturnValue(found);
      repo.hasUsage.mockReturnValue(true);
      expect(service.get(1)).toEqual({ ...found, unit_locked: true });
    });

    test("get marks unlocked when neither supplies nor usages exist", () => {
      const found = row();
      repo.getById.mockReturnValue(found);
      expect(service.get(1)).toEqual({ ...found, unit_locked: false });
    });

    test("createVariant computes unit_locked via the same helper", () => {
      const created = row();
      repo.getByMaterial.mockReturnValue([]);
      repo.create.mockReturnValue(created);
      supplyService.getAllByVariant.mockReturnValue([{} as SupplySchema]);
      expect(service.createVariant(created)).toEqual({
        ...created,
        unit_locked: true,
      });
    });

    test("updateVariant returns the updated row decorated", () => {
      const updated = row({ name: "new name" });
      repo.getById.mockReturnValue(row());
      repo.getByMaterial.mockReturnValue([]);
      repo.update.mockReturnValue(updated);
      expect(service.updateVariant(1, { name: "new name" })).toEqual({
        ...updated,
        unit_locked: false,
      });
    });

    test("restore returns the restored row decorated", () => {
      const restored = row();
      repo.getById.mockReturnValue(row());
      repo.getByMaterial.mockReturnValue([]);
      repo.restore.mockReturnValue(restored);
      expect(service.restore(1)).toEqual({ ...restored, unit_locked: false });
    });
  });

  describe("delete", () => {
    test("soft deletes when there are referencing supplies", () => {
      supplyService.getAllByVariant.mockReturnValue([{} as SupplySchema]);
      service.delete(0);
      expect(repo.softDelete).toHaveBeenCalled();
    });

    test("hard deletes when there are no referencing supplies", () => {
      supplyService.getAllByVariant.mockReturnValue([]);
      service.delete(0);
      expect(repo.hardDelete).toHaveBeenCalled();
    });

    test("soft deletes when usages exist even with no supplies", () => {
      repo.hasUsage.mockReturnValue(true);
      service.delete(0);
      expect(repo.softDelete).toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });

    test("hard deletes when neither supplies nor usages exist", () => {
      service.delete(0);
      expect(repo.hardDelete).toHaveBeenCalled();
      expect(repo.softDelete).not.toHaveBeenCalled();
    });
  });

  describe("createVariant", () => {
    test("creates a variant with a free name", () => {
      repo.getByMaterial.mockReturnValue([]);
      service.createVariant(row({ name: "Oak plank" }));
      expect(repo.create).toHaveBeenCalled();
    });

    test("rejects a name already used by another variant of the material", () => {
      repo.getByMaterial.mockReturnValue([row({ name: "Oak plank" })]);
      expect(() => service.createVariant(row({ name: "oak plank" }))).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("rejects a name held by a soft-deleted variant of the material", () => {
      repo.getByMaterial.mockReturnValue([
        row({ name: "Oak plank", deleted_at: new Date() }),
      ]);
      expect(() => service.createVariant(row({ name: "oak plank" }))).toThrow(
        ErrorMessages.NAME_RESERVED_BY_HIDDEN,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("allows the same name under another material", () => {
      repo.getByMaterial.mockReturnValue([]);
      service.createVariant(row({ name: "oak plank", material_id: 2 }));
      expect(repo.create).toHaveBeenCalled();
    });

    test("rejects a variant whose material does not exist", () => {
      repo.getMaterialReference.mockReturnValue(undefined);
      expect(() => service.createVariant(row())).toThrow(
        ErrorMessages.ITEM_NOT_FOUND,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("rejects a variant whose material is soft-deleted", () => {
      repo.getMaterialReference.mockReturnValue({
        id: 1,
        deleted_at: new Date(),
      });
      expect(() => service.createVariant(row())).toThrow(
        ErrorMessages.REFERENCED_ITEM_DELETED,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe("updateVariant", () => {
    test("rejects unit change when supplies reference the variant", () => {
      repo.getById.mockReturnValue(row({ unit: "meters" }));
      supplyService.getAllByVariant.mockReturnValue([{} as SupplySchema]);
      expect(() => service.updateVariant(0, { unit: "pieces" })).toThrow(
        ErrorMessages.UNIT_CHANGE_AFTER_USAGE,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("allows unit change when no supplies reference the variant", () => {
      repo.getById.mockReturnValue(row({ unit: "meters" }));
      supplyService.getAllByVariant.mockReturnValue([]);
      service.updateVariant(0, { unit: "pieces" });
      expect(repo.update).toHaveBeenCalledWith(0, { unit: "pieces" });
    });

    test("rejects unit change when usages exist even with no supplies", () => {
      repo.getById.mockReturnValue(row({ unit: "meters" }));
      repo.hasUsage.mockReturnValue(true);
      expect(() => service.updateVariant(0, { unit: "pieces" })).toThrow(
        ErrorMessages.UNIT_CHANGE_AFTER_USAGE,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("allows unchanged unit while supplies reference the variant", () => {
      repo.getById.mockReturnValue(row({ unit: "meters" }));
      supplyService.getAllByVariant.mockReturnValue([{} as SupplySchema]);
      repo.getByMaterial.mockReturnValue([]);
      service.updateVariant(0, { unit: "meters", name: "new name" });
      expect(repo.update).toHaveBeenCalled();
    });

    test("rejects a name already used by another variant of the material", () => {
      repo.getById.mockReturnValue(row({ name: "Oak plank" }));
      repo.getByMaterial.mockReturnValue([row({ id: 2, name: "Board" })]);
      expect(() => service.updateVariant(0, { name: "board" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("rejects renaming onto a soft-deleted variant's name", () => {
      repo.getById.mockReturnValue(row({ name: "Oak plank" }));
      repo.getByMaterial.mockReturnValue([
        row({ id: 2, name: "Board", deleted_at: new Date() }),
      ]);
      expect(() => service.updateVariant(0, { name: "board" })).toThrow(
        ErrorMessages.NAME_RESERVED_BY_HIDDEN,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("allows a name only the row itself already uses", () => {
      repo.getById.mockReturnValue(row({ name: "Oak plank" }));
      repo.getByMaterial.mockReturnValue([row({ name: "oak plank" })]);
      service.updateVariant(0, { name: "Oak plank" });
      expect(repo.update).toHaveBeenCalled();
    });

    test("renames a soft-deleted variant when only the name changes", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      repo.getByMaterial.mockReturnValue([]);
      service.updateVariant(0, { name: "new name" });
      expect(repo.update).toHaveBeenCalledWith(0, { name: "new name" });
    });

    test("rejects a non-name edit on a soft-deleted variant", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      expect(() => service.updateVariant(0, { unit: "pieces" })).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("rejects an empty patch on a soft-deleted variant", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      expect(() => service.updateVariant(0, {})).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("propagates not found for a missing variant", () => {
      repo.getById.mockImplementation(() => {
        throw new Error(ErrorMessages.ITEM_NOT_FOUND);
      });
      expect(() => service.updateVariant(0, { name: "new name" })).toThrow(
        ErrorMessages.ITEM_NOT_FOUND,
      );
    });
    test("checks the name when only the material changes", () => {
      repo.getById.mockReturnValue(row({ name: "Oak plank" }));
      repo.getByMaterial.mockReturnValue([row({ id: 2, name: "Oak plank" })]);
      expect(() => service.updateVariant(0, { material_id: 2 })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("rejects moving a variant under a missing material", () => {
      repo.getById.mockReturnValue(row());
      repo.getMaterialReference.mockReturnValue(undefined);
      expect(() => service.updateVariant(0, { material_id: 999 })).toThrow(
        ErrorMessages.ITEM_NOT_FOUND,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("rejects moving a variant under a soft-deleted material", () => {
      repo.getById.mockReturnValue(row());
      repo.getMaterialReference.mockReturnValue({
        id: 2,
        deleted_at: new Date(),
      });
      expect(() => service.updateVariant(0, { material_id: 2 })).toThrow(
        ErrorMessages.REFERENCED_ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("restore", () => {
    test("restores the row", () => {
      repo.getById.mockReturnValue(row());
      service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    test("restores even when another active variant of the same material uses the name", () => {
      repo.getById.mockReturnValue(row({ id: 2, name: "Oak plank" }));
      service.restore(2);
      expect(repo.restore).toHaveBeenCalledWith(2);
    });
  });
});
