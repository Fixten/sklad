import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { stubRoutes } from "@/test/apiStub.vitest";

import useSupply from "./useSupply";

import type { Routes } from "@/test/apiStub";

const baseSupply = { unit: "meters" as const };

const routes = {
  "/api/supply": {
    get: () => [
      {
        ...baseSupply,
        id: 7,
        purchase_price: 24000,
        quantity: 8,
        remaining_quantity: 5,
        unit_purchase_cost: 3000,
        material_variant_id: 100,
        supplier_id: 5,
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        ...baseSupply,
        id: 8,
        purchase_price: 5000,
        quantity: 1,
        remaining_quantity: 0,
        unit_purchase_cost: 5000,
        material_variant_id: 100,
        created_at: "2026-01-01T00:00:00Z",
        deleted_at: "2026-01-01T00:00:00Z",
      },
    ],
  },
} satisfies Routes;

test("returns non-deleted supplies and keeps deleted rows on the query", async () => {
  stubRoutes(routes);

  const Harness = () => {
    const { supplies, query } = useSupply();

    return (
      <>
        <div data-testid="filtered">{supplies.length}</div>
        <div data-testid="raw">{query.data?.length ?? 0}</div>
      </>
    );
  };

  const screen = await render(
    <QueryClientProvider client={new QueryClient()}>
      <Harness />
    </QueryClientProvider>,
  );

  await expect.element(screen.getByTestId("filtered")).toHaveTextContent("1");
  await expect.element(screen.getByTestId("raw")).toHaveTextContent("2");
});
