import { ErrorMessages } from "@/constants/Errors.js";

import { MaterialRepository } from "../material/material.repository.js";
import { MaterialSchema } from "../material/material.schema.js";
import { MaterialService } from "../material/material.service.js";
import { MaterialVariantService } from "../materialVariant/materialVariant.service.js";

import MaterialTypeRepository from "./materialType.repository.js";
import { MaterialTypeSchema } from "./materialType.schema.js";
import MaterialTypeService from "./materialType.service.js";

jest.mock("./materialType.repository.js");
jest.mock("../material/material.service.js");

function row(overrides: Partial<MaterialTypeSchema> = {}): MaterialTypeSchema {
  return {
    id: 1,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    name: "Wood",
    description: null,
    ...overrides,
  };
}

describe("materialType service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let repo: jest.Mocked<MaterialTypeRepository>;
  let materialService: jest.Mocked<MaterialService>;
  let service: MaterialTypeService;
  beforeEach(() => {
    materialService = new MaterialService(
      {} as MaterialRepository,
      {} as MaterialVariantService,
    ) as jest.Mocked<MaterialService>;
    repo = new MaterialTypeRepository() as jest.Mocked<MaterialTypeRepository>;
    service = new MaterialTypeService(repo, materialService);
  });

  describe("delete", () => {
    it("soft deletes type when materials reference it", async () => {
      materialService.getByType.mockResolvedValue([{} as MaterialSchema]);
      await service.delete(0);
      expect(repo.softDelete).toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });

    it("hard deletes type when no materials reference it", async () => {
      materialService.getByType.mockResolvedValue([]);
      await service.delete(0);
      expect(repo.softDelete).not.toHaveBeenCalled();
      expect(repo.hardDelete).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates a type with a free name", async () => {
      repo.getAllActive.mockResolvedValue([]);
      await service.create(row());
      expect(repo.create).toHaveBeenCalled();
    });

    it("rejects a name already used by another type", async () => {
      repo.getAllActive.mockResolvedValue([row({ name: "Wood" })]);
      await expect(service.create(row({ name: "WOOD" }))).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("rejects editing a soft-deleted type", async () => {
      repo.getById.mockResolvedValue(row({ deleted_at: new Date() }));
      await expect(service.update(0, { name: "new" })).rejects.toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejects a name already used by another type", async () => {
      repo.getById.mockResolvedValue(row({ name: "Wood" }));
      repo.getAllActive.mockResolvedValue([row({ id: 2, name: "Metal" })]);
      await expect(service.update(0, { name: "metal" })).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("allows a name only the row itself already uses", async () => {
      repo.getById.mockResolvedValue(row({ name: "Wood" }));
      repo.getAllActive.mockResolvedValue([row({ name: "wood" })]);
      await service.update(0, { name: "wood" });
      expect(repo.update).toHaveBeenCalledWith(0, { name: "wood" });
    });

    it("does not check the name when it is not part of the update", async () => {
      repo.getById.mockResolvedValue(row());
      await service.update(0, { description: "hardwood" });
      expect(repo.getAllActive).not.toHaveBeenCalled();
      expect(repo.update).toHaveBeenCalledWith(0, { description: "hardwood" });
    });
  });

  describe("restore", () => {
    it("restores the row", async () => {
      repo.getById.mockResolvedValue(row());
      repo.getAllActive.mockResolvedValue([]);
      await service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    it("is idempotent for an active row", async () => {
      repo.getById.mockResolvedValue(row());
      repo.getAllActive.mockResolvedValue([row()]);
      await service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    it("rejects when an active row already uses the name", async () => {
      repo.getById.mockResolvedValue(row({ id: 2, name: "Wood" }));
      repo.getAllActive.mockResolvedValue([row({ id: 1, name: "wood" })]);
      await expect(service.restore(2)).rejects.toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.restore).not.toHaveBeenCalled();
    });
  });
});
