import { ErrorMessages } from "@/constants/Errors.js";

import SupplyService from "../supply/supply.service.js";

import SupplierRepository from "./supplier.repository.js";
import { SupplierSchema } from "./supplier.schema.js";
import SupplierService from "./supplier.service.js";

jest.mock("../supply/supply.service.js");
jest.mock("./supplier.repository.js");

function row(overrides: Partial<SupplierSchema> = {}): SupplierSchema {
  return {
    id: 1,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    name: "Lumber Co",
    description: null,
    url: null,
    contact: null,
    ...overrides,
  };
}

describe("SupplierService", () => {
  let repo: jest.Mocked<SupplierRepository>;
  let supply: jest.Mocked<SupplyService>;
  let service: SupplierService;

  beforeEach(() => {
    repo = new SupplierRepository() as jest.Mocked<SupplierRepository>;
    supply = new SupplyService(
      {} as never,
    ) as unknown as jest.Mocked<SupplyService>;
    service = new SupplierService(repo, supply);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    test("stores the name and defaults the optional fields to null", () => {
      repo.getAllActive.mockReturnValue([]);
      repo.create.mockImplementation((value) => row(value));

      service.create({ name: "Lumber Co" });

      expect(repo.create).toHaveBeenCalledWith({
        name: "Lumber Co",
        description: null,
        url: null,
        contact: null,
      });
    });

    test("rejects a name already used by another active supplier", () => {
      repo.getAllActive.mockReturnValue([row({ name: "Lumber Co" })]);

      expect(() => service.create({ name: "lumber co" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    test("updates a supplier keeping its own name", () => {
      repo.getById.mockReturnValue(row());
      repo.getAllActive.mockReturnValue([row()]);

      service.update(1, { name: "lumber co", contact: "mail" });

      expect(repo.update).toHaveBeenCalledWith(1, {
        name: "lumber co",
        contact: "mail",
      });
    });

    test("rejects a name taken by another active supplier", () => {
      repo.getById.mockReturnValue(row({ id: 1 }));
      repo.getAllActive.mockReturnValue([row({ id: 2, name: "Lumber Co" })]);

      expect(() => service.update(1, { name: "Lumber Co" })).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("rejects editing a soft-deleted supplier", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));

      expect(() => service.update(1, { description: "late" })).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
      expect(repo.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("hard deletes a supplier without supplies", () => {
      supply.getAllBySupplier.mockReturnValue([]);

      service.delete(1);

      expect(repo.hardDelete).toHaveBeenCalledWith(1);
      expect(repo.softDelete).not.toHaveBeenCalled();
    });

    test("soft deletes a supplier referenced by a supply", () => {
      supply.getAllBySupplier.mockReturnValue([{} as never]);

      service.delete(1);

      expect(repo.softDelete).toHaveBeenCalledWith(1);
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });
  });

  describe("restore", () => {
    test("restores a supplier whose name is still free", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      repo.getAllActive.mockReturnValue([]);
      repo.restore.mockImplementation((id) => row({ id }));

      service.restore(1);

      expect(repo.restore).toHaveBeenCalledWith(1);
    });

    test("rejects restoring into a name now taken by an active supplier", () => {
      repo.getById.mockReturnValue(row({ deleted_at: new Date() }));
      repo.getAllActive.mockReturnValue([row({ id: 2, name: "Lumber Co" })]);

      expect(() => service.restore(1)).toThrow(
        ErrorMessages.NAME_ALREADY_EXISTS,
      );
      expect(repo.restore).not.toHaveBeenCalled();
    });
  });
});
