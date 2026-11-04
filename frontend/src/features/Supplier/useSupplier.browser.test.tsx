import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { stubRoutes } from "@/test/apiStub.vitest";

import useSupplier from "./useSupplier";

import type { Routes } from "@/test/apiStub";

const routes = {
  "/api/supplier": {
    get: () => [
      { id: 5, name: "Столярный двор", created_at: "2026-01-01T00:00:00Z" },
      {
        id: 6,
        name: "Снятый поставщик",
        created_at: "2026-01-01T00:00:00Z",
        deleted_at: "2026-01-01T00:00:00Z",
      },
    ],
  },
} satisfies Routes;

test("returns non-deleted suppliers and keeps deleted rows on the query", async () => {
  stubRoutes(routes);

  const Harness = () => {
    const { suppliers, query } = useSupplier();

    return (
      <>
        <div data-testid="filtered">{suppliers.length}</div>
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
