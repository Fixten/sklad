import { ErrorMessages } from "@/constants/Errors.js";

import { MaterialVariantRepository } from "../materialVariant/materialVariant.repository.js";
import { MaterialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { MaterialVariantService } from "../materialVariant/materialVariant.service.js";

import { MaterialRepository } from "./material.repository.js";
import { MaterialSchema } from "./material.schema.js";
import { MaterialService } from "./material.service.js";

jest.mock("./material.repository.js");
jest.mock("../materialVariant/materialVariant.service.js");

function row(overrides: Partial<MaterialSchema> = {}): MaterialSchema {
  return {
    id: 1,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    name: "Oak",
    description: null,
    material_type_id: 1,
    ...overrides,
  };
}

describe("material service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let repo: jest.Mocked<MaterialRepository>;
  let variantService: jest.Mocked<MaterialVariantService>;
  let service: MaterialService;
  beforeEach(() => {
    variantService = new MaterialVariantService(
      {} as never,
      {} as MaterialVariantRepository,
    ) as jest.Mocked<MaterialVariantService>;
    repo = new MaterialRepository() as jest.Mocked<MaterialRepository>;
    service = new MaterialService(repo, variantService);
  });

  describe("deleteMaterial", () => {
    it("soft deletes material when variants reference it", () => {
      variantService.getByMaterial.mockReturnValue([
        {} as MaterialVariantSchema,
      ]);
      service.delete(0);
      expect(repo.softDelete).toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });

    it("hard deletes material when no variants reference it", () => {
      variantService.getByMaterial.mockReturnValue([]);
      service.delete(0);
      expect(repo.softDelete).not.toHaveBeenCalled();
      expect(repo.hardDelete).toHaveBeenCalled();
    });

    it("propagates error and does not delete when variant lookup fails", () => {
      variantService.getByMaterial.mockImplementation(() => {
        throw new Error();
      });
      expect(() => service.delete(0)).toThrow();
      expect(repo.softDelete).not.toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates a material with a name free within its type", () => {
      repo.getActiveByType.mockReturnValue([]);
      service.create(row());
      expect(repo.create).toHaveBeenCalled();
    });

    it("rejects a name already used within the same type", () => {
      repo.getActiveByType.mockReturnValue([row({ name: "Oak" })]);
      expect(() => service.create(row({ name: "oak" }))).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it("allows the same name in another type", () => {
      repo.getActiveByType.mockReturnValue([]);
      service.create(row({ name: "oak", material_type_id: 2 }));
      expect(repo.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("rejects editing a soft-deleted material", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      expect(() => service.update(0, { name: "new" })).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejects a name already used within the same type", () => {
      repo.getById.mockReturnValue(row({ name: "Oak" }));
      repo.getActiveByType.mockReturnValue([row({ id: 2, name: "Ash" })]);
      expect(() => service.update(0, { name: "ASH" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("allows a name only the row itself already uses", () => {
      repo.getById.mockReturnValue(row({ name: "Oak" }));
      repo.getActiveByType.mockReturnValue([row({ name: "oak" })]);
      service.update(0, { name: "oak" });
      expect(repo.update).toHaveBeenCalledWith(0, { name: "oak" });
    });
    it("checks the name when only the type changes", () => {
      repo.getById.mockReturnValue(row({ name: "Oak" }));
      repo.getActiveByType.mockReturnValue([row({ id: 2, name: "Oak" })]);
      expect(() => service.update(0, { material_type_id: 2 })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("restore", () => {
    it("restores the row", () => {
      repo.getById.mockReturnValue(row());
      repo.getActiveByType.mockReturnValue([]);
      service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    it("rejects when an active material in the same type already uses the name", () => {
      repo.getById.mockReturnValue(row({ id: 2, name: "Oak" }));
      repo.getActiveByType.mockReturnValue([row({ id: 1, name: "oak" })]);
      expect(() => service.restore(2)).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.restore).not.toHaveBeenCalled();
    });

    it("propagates not found for a missing material", () => {
      repo.getById.mockImplementation(() => {
        throw new Error(ErrorMessages.ITEM_NOT_FOUND);
      });
      expect(() => service.restore(999)).toThrow(ErrorMessages.ITEM_NOT_FOUND);
    });
  });
});
