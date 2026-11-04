import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { stubRoutes } from "@/test/apiStub.vitest";

import useMaterial from "./useMaterial";

import type { Routes } from "@/test/apiStub";

const routes = {
  "/api/material": {
    get: () => [
      {
        id: 10,
        name: "Дуб",
        material_type_id: 1,
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: 11,
        name: "Клён",
        material_type_id: 1,
        created_at: "2026-01-01T00:00:00Z",
        deleted_at: "2026-01-01T00:00:00Z",
      },
    ],
  },
} satisfies Routes;

test("returns non-deleted materials and keeps deleted rows on the query", async () => {
  stubRoutes(routes);

  const Harness = () => {
    const { materials, query } = useMaterial();

    return (
      <>
        <div data-testid="filtered">{materials.length}</div>
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
