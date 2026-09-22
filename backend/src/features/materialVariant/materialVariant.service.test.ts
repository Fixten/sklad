import { ErrorMessages } from "@/constants/Errors.js";

import { SupplyRepository } from "../supply/supply.repository.js";
import { SupplySchema } from "../supply/supply.schema.js";

import { MaterialVariantRepository } from "./materialVariant.repository.js";
import { MaterialVariantSchema } from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";

jest.mock("../supply/supply.repository.js");
jest.mock("./materialVariant.repository.js");

describe("VariantService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  let supplyRepo: jest.Mocked<SupplyRepository>;
  let repo: jest.Mocked<MaterialVariantRepository>;
  beforeEach(() => {
    supplyRepo = new SupplyRepository() as jest.Mocked<SupplyRepository>;
    repo =
      new MaterialVariantRepository() as jest.Mocked<MaterialVariantRepository>;
  });

  describe("deleteVariant", () => {
    test("soft deletes when there are referencing supplies", async () => {
      supplyRepo.getByVariant.mockResolvedValue([{} as SupplySchema]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.deleteVariant(0);
      expect(repo.softDelete).toHaveBeenCalled();
    });

    test("hard deletes when there are no referencing supplies", async () => {
      supplyRepo.getByVariant.mockResolvedValue([]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.deleteVariant(0);
      expect(repo.hardDelete).toHaveBeenCalled();
    });
  });

  describe("createVariant", () => {
    test("rejects unsupported unit", async () => {
      const service = new MaterialVariantService(supplyRepo, repo);
      await expect(
        service.createVariant({ unit: "kilometers" } as MaterialVariantSchema),
      ).rejects.toThrow(ErrorMessages.WRONG_UNIT);
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("creates variant with supported unit", async () => {
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.createVariant({ unit: "pieces" } as MaterialVariantSchema);
      expect(repo.create).toHaveBeenCalled();
    });
  });

  describe("updateVariant", () => {
    test("rejects unit change when supplies reference the variant", async () => {
      repo.getById.mockResolvedValue({
        unit: "meters",
      } as MaterialVariantSchema);
      supplyRepo.getByVariant.mockResolvedValue([{} as SupplySchema]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await expect(
        service.updateVariant(0, { unit: "pieces" }),
      ).rejects.toThrow(ErrorMessages.UNIT_CHANGE_AFTER_USAGE);
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("allows unit change when no supplies reference the variant", async () => {
      repo.getById.mockResolvedValue({
        unit: "meters",
      } as MaterialVariantSchema);
      supplyRepo.getByVariant.mockResolvedValue([]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.updateVariant(0, { unit: "pieces" });
      expect(repo.update).toHaveBeenCalledWith(0, { unit: "pieces" });
    });

    test("rejects invalid unit on update", async () => {
      repo.getById.mockResolvedValue({
        unit: "meters",
      } as MaterialVariantSchema);
      supplyRepo.getByVariant.mockResolvedValue([]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await expect(
        service.updateVariant(0, { unit: "gallons" }),
      ).rejects.toThrow(ErrorMessages.WRONG_UNIT);
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("allows unchanged unit while supplies reference the variant", async () => {
      repo.getById.mockResolvedValue({
        unit: "pieces",
      } as MaterialVariantSchema);
      supplyRepo.getByVariant.mockResolvedValue([{} as SupplySchema]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.updateVariant(0, { unit: "pieces", name: "new name" });
      expect(repo.update).toHaveBeenCalledWith(0, {
        unit: "pieces",
        name: "new name",
      });
    });

    test("updates non-unit fields without unit or supply checks", async () => {
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.updateVariant(0, { name: "new name" });
      expect(repo.getById).not.toHaveBeenCalled();
      expect(supplyRepo.getByVariant).not.toHaveBeenCalled();
      expect(repo.update).toHaveBeenCalledWith(0, { name: "new name" });
    });
  });
});
