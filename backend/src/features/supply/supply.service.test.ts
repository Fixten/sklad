import { ErrorMessages } from "@/constants/Errors.js";

import { SupplyRepository, SupplyView } from "./supply.repository.js";
import { SupplyModel } from "./supply.schema.js";
import SupplyService from "./supply.service.js";

jest.mock("./supply.repository.js");

function view(overrides: Partial<SupplyView> = {}): SupplyView {
  return {
    id: 1,
    description: null,
    purchase_price: 10000,
    quantity: 10,
    url: null,
    material_variant_id: 1,
    supplier_id: null,
    created_at: new Date(),
    updated_at: null,
    deleted_at: null,
    unit: "pieces",
    consumed_quantity: 0,
    ...overrides,
  };
}

describe("SupplyService", () => {
  let repo: jest.Mocked<SupplyRepository>;
  let service: SupplyService;

  beforeEach(() => {
    repo = new SupplyRepository() as jest.Mocked<SupplyRepository>;
    service = new SupplyService(repo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Runs `service.update` against a stand-in for `updateAtomically`, capturing
   * the patch the service decided to write and returning the row as it would
   * look afterwards. The repository owns the transaction and the re-read, so
   * what is under test here is the decision.
   */
  function decideFrom(current: SupplyView, written?: SupplyView) {
    let decided: Partial<SupplyModel> = {};
    repo.updateAtomically.mockImplementation((_id, decide) => {
      decided = decide(current);
      return { ...(written ?? current), ...decided };
    });
    return () => decided;
  }

  /** The real `requireViewById` throws; the automatic mock does not. */
  function givenMissingSupply() {
    repo.requireViewById.mockImplementation(() => {
      throw new Error(ErrorMessages.ITEM_NOT_FOUND);
    });
  }

  describe("get", () => {
    test("exposes the derived remaining quantity and unit cost", () => {
      repo.requireViewById.mockReturnValue(
        view({ quantity: 10, purchase_price: 10000, consumed_quantity: 4 }),
      );

      const row = service.get(1);

      expect(row.remaining_quantity).toBe(6);
      expect(row.purchase_price).toBe(100);
      expect(row.unit_purchase_cost).toBe(10);
    });

    test("keeps meter precision on the derived values", () => {
      repo.requireViewById.mockReturnValue(
        view({
          unit: "meters",
          quantity: 1250,
          purchase_price: 12550,
          consumed_quantity: 250,
        }),
      );

      const row = service.get(1);

      expect(row.quantity).toBe(1.25);
      expect(row.remaining_quantity).toBe(1);
      expect(row.unit_purchase_cost).toBe(100.4);
    });

    test("throws when the supply does not exist", () => {
      givenMissingSupply();
      expect(() => service.get(1)).toThrow(ErrorMessages.ITEM_NOT_FOUND);
    });
  });

  describe("getStock", () => {
    test("sums the remaining quantities of the active supplies", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "meters",
        deleted_at: null,
      });
      repo.getFilteredViews.mockReturnValue([
        view({ unit: "meters", quantity: 1250, consumed_quantity: 250 }),
        view({ id: 2, unit: "meters", quantity: 500, consumed_quantity: 500 }),
      ]);

      const stock = service.getStock(1);

      expect(stock).toEqual({
        material_variant_id: 1,
        unit: "meters",
        quantity: 1,
      });
    });

    test("excludes deleted supplies from the stock", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: null,
      });
      repo.getFilteredViews.mockReturnValue([]);

      expect(service.getStock(1)).toEqual({
        material_variant_id: 1,
        unit: "pieces",
        quantity: 0,
      });
    });

    test("reads the stock of a soft-deleted variant", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: new Date(),
      });
      repo.getFilteredViews.mockReturnValue([
        view({ unit: "pieces", quantity: 3, consumed_quantity: 1 }),
      ]);

      expect(service.getStock(1)).toEqual({
        material_variant_id: 1,
        unit: "pieces",
        quantity: 2,
      });
    });

    test("throws when the variant does not exist", () => {
      repo.getVariantReference.mockReturnValue(undefined);

      expect(() => service.getStock(999)).toThrow(ErrorMessages.ITEM_NOT_FOUND);
      expect(repo.getFilteredViews).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    test("converts decimals to kopecks and scaled quantities", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "meters",
        deleted_at: null,
      });
      repo.create.mockImplementation((value) => view({ ...value }));

      const row = service.create({
        material_variant_id: 1,
        purchase_price: "120.129",
        quantity: "1.250",
      });

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ purchase_price: 12012, quantity: 1250 }),
      );
      expect(row.quantity).toBe(1.25);
      expect(row.unit).toBe("meters");
    });

    test("rejects a supply for a missing variant", () => {
      repo.getVariantReference.mockReturnValue(undefined);

      expect(() =>
        service.create({
          material_variant_id: 999,
          purchase_price: 1,
          quantity: 1,
        }),
      ).toThrow(ErrorMessages.ITEM_NOT_FOUND);
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("rejects a supply for a soft-deleted variant", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: new Date(),
      });

      expect(() =>
        service.create({
          material_variant_id: 1,
          purchase_price: 1,
          quantity: 1,
        }),
      ).toThrow(ErrorMessages.REFERENCED_ITEM_DELETED);
    });

    test("rejects a quantity beyond the precision of the unit", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: null,
      });

      expect(() =>
        service.create({
          material_variant_id: 1,
          purchase_price: 1,
          quantity: 1.5,
        }),
      ).toThrow(ErrorMessages.INVALID_DECIMAL_PRECISION);
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("rejects a non-positive quantity and a negative price", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: null,
      });

      expect(() =>
        service.create({
          material_variant_id: 1,
          purchase_price: 1,
          quantity: 0,
        }),
      ).toThrow(ErrorMessages.QUANTITY_NOT_POSITIVE);
      expect(() =>
        service.create({
          material_variant_id: 1,
          purchase_price: "-0.01",
          quantity: 1,
        }),
      ).toThrow(ErrorMessages.PRICE_NEGATIVE);
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    test("corrects the quantity and price", () => {
      const decided = decideFrom(view());

      const row = service.update(1, {
        quantity: 7,
        purchase_price: "20.00",
      });

      expect(decided()).toEqual(
        expect.objectContaining({ quantity: 7, purchase_price: 2000 }),
      );
      expect(row.quantity).toBe(7);
      expect(row.purchase_price).toBe(20);
    });

    test("returns the updated_at the row carries after the patch", () => {
      const written = new Date("2026-02-03T04:05:06.000Z");
      decideFrom(view(), view({ updated_at: written }));

      const row = service.update(1, { purchase_price: 30 });

      expect(row.updated_at).toEqual(written);
    });

    test("leaves omitted fields out of the patch", () => {
      const decided = decideFrom(view({ description: "batch" }));

      service.update(1, { purchase_price: 30 });

      expect(decided()).toEqual({ purchase_price: 3000 });
    });

    test("rejects editing a soft-deleted supply", () => {
      decideFrom(view({ deleted_at: new Date() }));

      expect(() => service.update(1, { quantity: 5 })).toThrow(
        ErrorMessages.ITEM_DELETED,
      );
    });

    test("rejects correcting the quantity below the consumed amount", () => {
      decideFrom(view({ quantity: 10, consumed_quantity: 4 }));

      expect(() => service.update(1, { quantity: 3 })).toThrow(
        ErrorMessages.QUANTITY_BELOW_CONSUMED,
      );
    });

    test("accepts a correction down to the consumed amount", () => {
      const decided = decideFrom(view({ quantity: 10, consumed_quantity: 4 }));

      service.update(1, { quantity: 4 });

      expect(decided()).toEqual({ quantity: 4 });
    });

    test("scales a quantity with the unit of a newly assigned variant", () => {
      const decided = decideFrom(view());
      repo.getVariantReference.mockReturnValue({
        id: 2,
        unit: "meters",
        deleted_at: null,
      });

      service.update(1, { material_variant_id: 2, quantity: "1.250" });

      expect(decided()).toEqual(
        expect.objectContaining({ material_variant_id: 2, quantity: 1250 }),
      );
    });

    test("rejects moving a consumed supply to another variant", () => {
      decideFrom(view({ consumed_quantity: 4 }));

      expect(() => service.update(1, { material_variant_id: 2 })).toThrow(
        ErrorMessages.VARIANT_CHANGE_AFTER_USAGE,
      );
    });

    test("requires a quantity when the move changes the unit", () => {
      decideFrom(view({ unit: "pieces" }));
      repo.getVariantReference.mockReturnValue({
        id: 2,
        unit: "meters",
        deleted_at: null,
      });

      expect(() => service.update(1, { material_variant_id: 2 })).toThrow(
        ErrorMessages.QUANTITY_REQUIRED_FOR_UNIT_CHANGE,
      );
    });

    test("allows a move without a quantity when the unit is unchanged", () => {
      const decided = decideFrom(view({ unit: "pieces" }));
      repo.getVariantReference.mockReturnValue({
        id: 2,
        unit: "pieces",
        deleted_at: null,
      });

      service.update(1, { material_variant_id: 2 });

      expect(decided()).toEqual({ material_variant_id: 2 });
    });
  });

  describe("supplier reference", () => {
    test("rejects attaching a supply to a missing supplier", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: null,
      });
      repo.getSupplierReference.mockReturnValue(undefined);

      expect(() =>
        service.create({
          material_variant_id: 1,
          purchase_price: 1,
          quantity: 1,
          supplier_id: 99,
        }),
      ).toThrow(ErrorMessages.ITEM_NOT_FOUND);
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("attaches a supply to a soft-deleted supplier", () => {
      repo.getVariantReference.mockReturnValue({
        id: 1,
        unit: "pieces",
        deleted_at: null,
      });
      repo.getSupplierReference.mockReturnValue({
        id: 2,
        deleted_at: new Date(),
      });
      repo.create.mockReturnValue(view({ id: 2, supplier_id: 2 }));

      service.create({
        material_variant_id: 1,
        purchase_price: 1,
        quantity: 1,
        supplier_id: 2,
      });

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ supplier_id: 2 }),
      );
    });

    test("leaves a supply editable when its supplier is already deleted", () => {
      const decided = decideFrom(view({ supplier_id: 2, deleted_at: null }));
      repo.getSupplierReference.mockReturnValue({
        id: 2,
        deleted_at: new Date(),
      });

      service.update(1, { supplier_id: 2, description: "late edit" });

      expect(repo.getSupplierReference).not.toHaveBeenCalled();
      expect(decided()).toEqual({ description: "late edit" });
    });

    test("accepts switching to a soft-deleted supplier", () => {
      const decided = decideFrom(view({ supplier_id: 2 }));
      repo.getSupplierReference.mockReturnValue({
        id: 3,
        deleted_at: new Date(),
      });

      service.update(1, { supplier_id: 3 });

      expect(decided()).toEqual({ supplier_id: 3 });
    });

    test("accepts switching to an active supplier", () => {
      const decided = decideFrom(view({ supplier_id: 2 }));
      repo.getSupplierReference.mockReturnValue({ id: 3, deleted_at: null });

      service.update(1, { supplier_id: 3 });

      expect(decided()).toEqual({ supplier_id: 3 });
    });
  });

  describe("delete and restore", () => {
    test("soft deletes a supply that has consumptions", () => {
      repo.requireViewById.mockReturnValue(view());
      repo.hasConsumptions.mockReturnValue(true);
      service.delete(1);
      expect(repo.softDelete).toHaveBeenCalledWith(1);
      expect(repo.hardDelete).not.toHaveBeenCalled();
    });

    test("hard deletes a supply without consumptions", () => {
      repo.requireViewById.mockReturnValue(view());
      repo.hasConsumptions.mockReturnValue(false);
      service.delete(1);
      expect(repo.hardDelete).toHaveBeenCalledWith(1);
      expect(repo.softDelete).not.toHaveBeenCalled();
    });

    test("does not delete a missing supply", () => {
      repo.hasConsumptions.mockReturnValue(false);
      repo.hardDelete.mockImplementation(() => {
        throw new Error(ErrorMessages.ITEM_TO_DELETE_NOT_FOUND);
      });

      expect(() => service.delete(1)).toThrow(
        ErrorMessages.ITEM_TO_DELETE_NOT_FOUND,
      );
      expect(repo.softDelete).not.toHaveBeenCalled();
    });

    test("restores a soft-deleted supply", () => {
      repo.requireViewById.mockReturnValue(view({ deleted_at: new Date() }));
      service.restore(1);
      expect(repo.restore).toHaveBeenCalledWith(1);
    });
  });
});
