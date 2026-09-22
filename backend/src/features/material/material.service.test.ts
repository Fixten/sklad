import { MaterialVariantRepository } from "../materialVariant/materialVariant.repository.js";
import { MaterialVariantSchema } from "../materialVariant/materialVariant.schema.js";
import { MaterialVariantService } from "../materialVariant/materialVariant.service.js";
import { SupplyRepository } from "../supply/supply.repository.js";

import { MaterialRepository } from "./material.repository.js";
import { MaterialService } from "./material.service.js";

jest.mock("./material.repository.js");
jest.mock("../materialVariant/materialVariant.service.js");

describe("material service", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  let repo: jest.Mocked<MaterialRepository>;
  let variantService: jest.Mocked<MaterialVariantService>;
  let service: MaterialService;
  beforeEach(() => {
    variantService = new MaterialVariantService(
      {} as SupplyRepository,
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
});