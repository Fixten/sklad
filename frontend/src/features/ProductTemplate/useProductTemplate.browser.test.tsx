import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import type { Routes } from "@/test/apiStub";
import { stubRoutes } from "@/test/apiStub.vitest";

import useProductTemplateData from "./useProductTemplate";

const routes = {
  "/api/product-template": {
    get: () => [
      {
        id: 10,
        name: "Стол",
        materials: [],
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        id: 11,
        name: "Скрытый шаблон",
        materials: [],
        created_at: "2026-01-01T00:00:00Z",
        deleted_at: "2026-01-02T00:00:00Z",
      },
    ],
  },
} satisfies Routes;

test("loads hidden-inclusive templates and filters active rows", async () => {
  const requests = stubRoutes(routes);

  const Harness = () => {
    const { getActiveData, getAllData, query } = useProductTemplateData();

    return (
      <>
        <div data-testid="filtered">{getActiveData().length}</div>
        <div data-testid="raw">{query.data?.length ?? 0}</div>
        <div data-testid="all">{getAllData().length}</div>
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
  expect(requests[0]).toMatchObject({
    path: "/api/product-template",
    method: "GET",
    search: "?hidden=true",
  });
});
