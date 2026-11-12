import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import type { Routes } from "@/test/apiStub";
import { stubRoutes } from "@/test/apiStub.vitest";

import useMaterial from "./useMaterial";

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
  const requests = stubRoutes(routes);

  const Harness = () => {
    const { materials, rows, query } = useMaterial();

    return (
      <>
        <div data-testid="filtered">{materials.length}</div>
        <div data-testid="raw">{query.data?.length ?? 0}</div>
        <div data-testid="all">{rows.length}</div>
        <div data-testid="hidden">
          {rows.filter((row) => row.deleted_at).length}
        </div>
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
  await expect.element(screen.getByTestId("all")).toHaveTextContent("2");
  await expect.element(screen.getByTestId("hidden")).toHaveTextContent("1");
  expect(requests[0]?.search).toBe("?hidden=true");
});
