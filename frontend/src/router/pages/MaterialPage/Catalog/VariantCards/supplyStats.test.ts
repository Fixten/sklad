import { expect, test } from "vitest";

import type { SupplyModel } from "@/features/Supply/Supply.model";

import { supplyStatsByVariant } from "./supplyStats";

const row = (
  id: number,
  material_variant_id: number,
  remaining_quantity: number,
  created_at: string,
): SupplyModel => ({
  id,
  material_variant_id,
  remaining_quantity,
  created_at,
  purchase_price: 0,
  quantity: remaining_quantity,
  unit: "pieces",
  unit_purchase_cost: 0,
});

test("sums supplies for one variant", () => {
  const stats = supplyStatsByVariant([
    row(1, 10, 4.5, "2026-01-01T00:00:00Z"),
    row(2, 10, 2.5, "2026-01-02T00:00:00Z"),
  ]);

  expect(stats.get(10)).toEqual({
    stock: 7,
    lastSupply: "2026-01-02T00:00:00Z",
  });
});

test("sums fractional quantities", () => {
  const stats = supplyStatsByVariant([
    row(1, 10, 0.1, "2026-01-01T00:00:00Z"),
    row(2, 10, 0.2, "2026-01-02T00:00:00Z"),
  ]);

  expect(stats.get(10)?.stock).toBeCloseTo(0.3);
});

test("keeps the latest created_at as the last supply date", () => {
  const stats = supplyStatsByVariant([
    row(1, 10, 1, "2026-03-15T00:00:00Z"),
    row(2, 10, 1, "2026-01-01T00:00:00Z"),
    row(3, 10, 1, "2026-02-10T00:00:00Z"),
  ]);

  expect(stats.get(10)?.lastSupply).toBe("2026-03-15T00:00:00Z");
});

test("keeps rows for different variants separate", () => {
  const stats = supplyStatsByVariant([
    row(1, 10, 4, "2026-01-01T00:00:00Z"),
    row(2, 20, 9, "2026-02-01T00:00:00Z"),
  ]);

  expect([...stats]).toEqual([
    [10, { stock: 4, lastSupply: "2026-01-01T00:00:00Z" }],
    [20, { stock: 9, lastSupply: "2026-02-01T00:00:00Z" }],
  ]);
});
