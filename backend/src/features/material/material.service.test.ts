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
    it("soft deletes material when variants reference it", async () => {
      variantService.getByMaterial.mockResolvedValue([
        {} as MaterialVariantSchema,
      ]);
      await service.delete(0);
      expect(repo.softDelete).toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });

    it("hard deletes material when no variants reference it", async () => {
      variantService.getByMaterial.mockResolvedValue([]);
      await service.delete(0);
      expect(repo.softDelete).not.toHaveBeenCalled();
      expect(repo.hardDelete).toHaveBeenCalled();
    });

    it("propagates error and does not delete when variant lookup fails", async () => {
      variantService.getByMaterial.mockRejectedValue(new Error());
      await expect(service.delete(0)).rejects.toBeTruthy();
      expect(repo.softDelete).not.toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates a material with a name free within its type", async () => {
      repo.getActiveByType.mockResolvedValue([]);
      await service.create(row());
      expect(repo.create).toHaveBeenCalled();
    });

    it("rejects a name already used within the same type", async () => {
      repo.getActiveByType.mockResolvedValue([row({ name: "Oak" })]);
      await expect(service.create(row({ name: "oak" }))).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it("allows the same name in another type", async () => {
      repo.getActiveByType.mockResolvedValue([]);
      await service.create(row({ name: "oak", material_type_id: 2 }));
      expect(repo.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("rejects editing a soft-deleted material", async () => {
      repo.getById.mockResolvedValue(row({ deleted_at: new Date() }));
      await expect(service.update(0, { name: "new" })).rejects.toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejects a name already used within the same type", async () => {
      repo.getById.mockResolvedValue(row({ name: "Oak" }));
      repo.getActiveByType.mockResolvedValue([row({ id: 2, name: "Ash" })]);
      await expect(service.update(0, { name: "ASH" })).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("allows a name only the row itself already uses", async () => {
      repo.getById.mockResolvedValue(row({ name: "Oak" }));
      repo.getActiveByType.mockResolvedValue([row({ name: "oak" })]);
      await service.update(0, { name: "oak" });
      expect(repo.update).toHaveBeenCalledWith(0, { name: "oak" });
    });
    it("checks the name when only the type changes", async () => {
      repo.getById.mockResolvedValue(row({ name: "Oak" }));
      repo.getActiveByType.mockResolvedValue([row({ id: 2, name: "Oak" })]);
      await expect(service.update(0, { material_type_id: 2 })).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("restore", () => {
    it("restores the row", async () => {
      repo.getById.mockResolvedValue(row());
      repo.getActiveByType.mockResolvedValue([]);
      await service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    it("rejects when an active material in the same type already uses the name", async () => {
      repo.getById.mockResolvedValue(row({ id: 2, name: "Oak" }));
      repo.getActiveByType.mockResolvedValue([row({ id: 1, name: "oak" })]);
      await expect(service.restore(2)).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.restore).not.toHaveBeenCalled();
    });

    it("propagates not found for a missing material", async () => {
      repo.getById.mockRejectedValue(new Error(ErrorMessages.ITEM_NOT_FOUND));
      await expect(service.restore(999)).rejects.toThrow(
        ErrorMessages.ITEM_NOT_FOUND,
      );
    });
  });
});
