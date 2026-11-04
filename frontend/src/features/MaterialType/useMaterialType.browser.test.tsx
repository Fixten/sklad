import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { stubRoutes } from "@/test/apiStub.vitest";

import useMaterialType from "./useMaterialType";

import type { Routes } from "@/test/apiStub";

const routes = {
  "/api/material-type": {
    get: () => [
      { id: 1, name: "Пиломатериал", created_at: "2026-01-01T00:00:00Z" },
      {
        id: 2,
        name: "Снятый тип",
        created_at: "2026-01-01T00:00:00Z",
        deleted_at: "2026-01-01T00:00:00Z",
      },
    ],
  },
} satisfies Routes;

test("returns non-deleted material types and keeps deleted rows on the query", async () => {
  stubRoutes(routes);

  const Harness = () => {
    const { types, query } = useMaterialType();

    return (
      <>
        <div data-testid="filtered">{types.length}</div>
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
