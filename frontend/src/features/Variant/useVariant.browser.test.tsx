import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { stubRoutes } from "@/test/apiStub.vitest";

import useVariant from "./useVariant";

import type { Routes } from "@/test/apiStub";

const routes = {
  "/api/material-variant": {
    get: () => [
      {
        id: 100,
        name: "Доска 40 мм",
        unit: "meters",
        material_id: 10,
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: 101,
        name: "Снятая доска",
        unit: "meters",
        material_id: 10,
        created_at: "2026-01-01T00:00:00Z",
        deleted_at: "2026-01-01T00:00:00Z",
      },
    ],
  },
} satisfies Routes;

test("returns non-deleted variants and keeps deleted rows on the query", async () => {
  stubRoutes(routes);

  const Harness = () => {
    const { variants, query } = useVariant();

    return (
      <>
        <div data-testid="filtered">{variants.length}</div>
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
