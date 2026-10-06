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
    service = new MaterialVariantService(supplyService, repo);
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
  });

  describe("createVariant", () => {
    test("creates a variant with a free name", () => {
      repo.getActiveByMaterial.mockReturnValue([]);
      service.createVariant(row({ name: "Oak plank" }));
      expect(repo.create).toHaveBeenCalled();
    });

    test("rejects a name already used by another variant of the material", () => {
      repo.getActiveByMaterial.mockReturnValue([row({ name: "Oak plank" })]);
      expect(() => service.createVariant(row({ name: "oak plank" }))).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("allows the same name under another material", () => {
      repo.getActiveByMaterial.mockReturnValue([]);
      service.createVariant(row({ name: "oak plank", material_id: 2 }));
      expect(repo.create).toHaveBeenCalled();
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

    test("allows unchanged unit while supplies reference the variant", () => {
      repo.getById.mockReturnValue(row({ unit: "meters" }));
      supplyService.getAllByVariant.mockReturnValue([{} as SupplySchema]);
      repo.getActiveByMaterial.mockReturnValue([]);
      service.updateVariant(0, { unit: "meters", name: "new name" });
      expect(repo.update).toHaveBeenCalled();
    });

    test("rejects a name already used by another variant of the material", () => {
      repo.getById.mockReturnValue(row({ name: "Oak plank" }));
      repo.getActiveByMaterial.mockReturnValue([row({ id: 2, name: "Board" })]);
      expect(() => service.updateVariant(0, { name: "board" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("allows a name only the row itself already uses", () => {
      repo.getById.mockReturnValue(row({ name: "Oak plank" }));
      repo.getActiveByMaterial.mockReturnValue([row({ name: "oak plank" })]);
      service.updateVariant(0, { name: "Oak plank" });
      expect(repo.update).toHaveBeenCalled();
    });

    test("rejects editing a soft-deleted variant", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      expect(() => service.updateVariant(0, { name: "new name" })).toThrow(
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
      repo.getActiveByMaterial.mockReturnValue([
        row({ id: 2, name: "Oak plank" }),
      ]);
      expect(() => service.updateVariant(0, { material_id: 2 })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("restore", () => {
    test("restores the row", () => {
      repo.getById.mockReturnValue(row());
      repo.getActiveByMaterial.mockReturnValue([]);
      service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    test("rejects when an active variant of the same material already uses the name", () => {
      repo.getById.mockReturnValue(row({ id: 2, name: "Oak plank" }));
      repo.getActiveByMaterial.mockReturnValue([
        row({ id: 1, name: "oak plank" }),
      ]);
      expect(() => service.restore(2)).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.restore).not.toHaveBeenCalled();
    });
  });
});
