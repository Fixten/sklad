import Repository from "@/db/repository.js";
import { MaterialRepository } from "./material.repository.js";

const collectionName = "collection-name";

jest.mock("@/db/repository.js");

describe("MaterialRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should get the correct collection from dbManager", () => {
      new MaterialRepository(collectionName);
      expect(Repository).toHaveBeenCalledWith(collectionName);
    });
  });
});
