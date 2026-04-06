import { MaterialVariantRepository } from "../materialVariant/materialVariant.repository.js";
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

  describe("material service class", () => {
    describe("deleteMaterial", () => {
      it("if soft deleted variants found do soft delete", async () => {
        variantService.deleteVariantForMaterial.mockResolvedValue([
          "softDelete",
        ]);
        await service.deleteMaterial(0);
        expect(repo.softDeleteMaterial).toHaveBeenCalled();
        expect(repo.deleteMaterial).not.toHaveBeenCalled();
      });

      it("if no soft deleted variants do hard delete", async () => {
        variantService.deleteVariantForMaterial.mockResolvedValue([
          "hardDelete",
        ]);
        await service.deleteMaterial(0);
        expect(repo.softDeleteMaterial).not.toHaveBeenCalled();
        expect(repo.deleteMaterial).toHaveBeenCalled();
      });
      it("if delete variant failes throw and dont call delete material", async () => {
        variantService.deleteVariantForMaterial.mockRejectedValue(new Error());
        try {
          await service.deleteMaterial(0);
        } catch (_) {
          expect(repo.softDeleteMaterial).not.toHaveBeenCalled();
          expect(repo.deleteMaterial).not.toHaveBeenCalled();
        }
      });
    });
  });
});
