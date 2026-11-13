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

  describe("getAll", () => {
    it("returns only active rows by default", () => {
      const active = [row()];
      repo.getAllActive.mockReturnValue(active);
      expect(service.getAll()).toEqual(active);
      expect(repo.getAll).not.toHaveBeenCalled();
    });

    it("returns active and soft-deleted rows with includeHidden", () => {
      const all = [row(), row({ id: 2, deleted_at: new Date() })];
      repo.getAll.mockReturnValue(all);
      expect(service.getAll({ includeHidden: true })).toEqual(all);
      expect(repo.getAllActive).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("soft deletes type when materials reference it", () => {
      materialService.getByType.mockReturnValue([{} as MaterialSchema]);
      service.delete(0);
      expect(repo.softDelete).toHaveBeenCalled();
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });

    it("hard deletes type when no materials reference it", () => {
      materialService.getByType.mockReturnValue([]);
      service.delete(0);
      expect(repo.softDelete).not.toHaveBeenCalled();
      expect(repo.hardDelete).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates a type with a free name", () => {
      repo.getAll.mockReturnValue([]);
      service.create(row());
      expect(repo.create).toHaveBeenCalled();
    });

    it("rejects a name already used by another type", () => {
      repo.getAll.mockReturnValue([row({ name: "Wood" })]);
      expect(() => service.create(row({ name: "WOOD" }))).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it("rejects a name held by a soft-deleted type", () => {
      repo.getAll.mockReturnValue([
        row({ name: "Wood", deleted_at: new Date() }),
      ]);
      expect(() => service.create(row({ name: "wood" }))).toThrow(
        ErrorMessages.NAME_RESERVED_BY_HIDDEN,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("renames a soft-deleted type when only the name changes", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      repo.getAll.mockReturnValue([]);
      service.update(0, { name: "new" });
      expect(repo.update).toHaveBeenCalledWith(0, { name: "new" });
    });

    it("rejects a non-name edit on a soft-deleted type", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      expect(() => service.update(0, { description: "late" })).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejects an empty patch on a soft-deleted type", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      expect(() => service.update(0, {})).toThrow(ErrorMessages.ITEM_DELETED);
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejects a name already used by another type", () => {
      repo.getById.mockReturnValue(row({ name: "Wood" }));
      repo.getAll.mockReturnValue([row({ id: 2, name: "Metal" })]);
      expect(() => service.update(0, { name: "metal" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("rejects renaming onto a soft-deleted type's name", () => {
      repo.getById.mockReturnValue(row({ name: "Wood" }));
      repo.getAll.mockReturnValue([
        row({ id: 2, name: "Metal", deleted_at: new Date() }),
      ]);
      expect(() => service.update(0, { name: "metal" })).toThrow(
        ErrorMessages.NAME_RESERVED_BY_HIDDEN,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    it("allows a name only the row itself already uses", () => {
      repo.getById.mockReturnValue(row({ name: "Wood" }));
      repo.getAll.mockReturnValue([row({ name: "wood" })]);
      service.update(0, { name: "wood" });
      expect(repo.update).toHaveBeenCalledWith(0, { name: "wood" });
    });

    it("does not check the name when it is not part of the update", () => {
      repo.getById.mockReturnValue(row());
      service.update(0, { description: "hardwood" });
      expect(repo.getAll).not.toHaveBeenCalled();
      expect(repo.update).toHaveBeenCalledWith(0, { description: "hardwood" });
    });
  });

  describe("restore", () => {
    it("restores the row", () => {
      repo.getById.mockReturnValue(row());
      service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    it("is idempotent for an active row", () => {
      repo.getById.mockReturnValue(row());
      service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    it("restores even when another active row uses the name", () => {
      repo.getById.mockReturnValue(row({ id: 2, name: "Wood" }));
      service.restore(2);
      expect(repo.restore).toHaveBeenCalledWith(2);
    });
  });
});
