import { MaterialRepository } from "../material/material.repository.js";
import { MaterialSchema } from "../material/material.schema.js";
import { MaterialService } from "../material/material.service.js";
import { MaterialVariantService } from "../materialVariant/materialVariant.service.js";

import MaterialTypeRepository from "./materialType.repository.js";
import MaterialTypeService from "./materialType.service.js";

jest.mock("./materialType.repository.js");
jest.mock("../material/material.service.js");

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
});