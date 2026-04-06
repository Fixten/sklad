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
    test("when there are references supplies soft delete", async () => {
      supplyRepo.getForVariant.mockResolvedValue([{} as SupplySchema]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.deleteVariant(0);
      expect(repo.softDelete).toHaveBeenCalled();
    });

    test("when there are no references supplies hard delete", async () => {
      supplyRepo.getForVariant.mockResolvedValue([]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.deleteVariant(0);
      expect(repo.deleteVariant).toHaveBeenCalled();
    });
  });

  describe("deleteVariantForMaterial", () => {
    test("call delete on every variant", async () => {
      supplyRepo.getForVariant.mockResolvedValue([]);
      repo.getByMeterial.mockResolvedValue([
        { id: 0 },
        { id: 1 },
      ] as MaterialVariantSchema[]);
      const service = new MaterialVariantService(supplyRepo, repo);
      await service.deleteVariantForMaterial(0);
      expect(repo.deleteVariant).toHaveBeenCalledWith(0);
      expect(repo.deleteVariant).toHaveBeenCalledWith(1);
    });
  });
});
