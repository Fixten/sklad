import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import type { MaterialModel } from "@/features/Material/Material.model";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import type { VariantModel } from "@/features/Variant/Variant.model";
import AppLayout from "@/layout/App.layout";
import { stubRoutes } from "@/test/apiStub.vitest";

import SupplyPage from "./SupplyPage";

import MaterialPage from "./index";

export interface PageFixtures {
  materials?: MaterialModel[];
  types?: MaterialTypeModel[];
  variants?: VariantModel[];
}

export const catalogFixtures = {
  types: [
    {
      id: 1,
      name: "Древесина",
      description: "Пиломатериалы",
      created_at: "2026-01-01T00:00:00.000Z",
    },
    { id: 2, name: "Металл", created_at: "2026-01-01T00:00:00.000Z" },
    {
      id: 3,
      name: "Скрытый тип",
      created_at: "2026-01-01T00:00:00.000Z",
      deleted_at: "2026-01-02T00:00:00.000Z",
    },
  ],
  materials: [
    {
      id: 10,
      name: "Доска сосна",
      description: "Сорт первый",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 11,
      name: "Болт",
      material_type_id: 2,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 12,
      name: "Скрытый материал",
      material_type_id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      deleted_at: "2026-01-02T00:00:00.000Z",
    },
    {
      id: 13,
      name: "Фанера",
      material_type_id: 3,
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  variants: [
    {
      id: 100,
      name: "Доска 100x20",
      unit: "meters",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 101,
      name: "Саморез 35",
      unit: "pieces",
      material_id: 11,
      created_at: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 102,
      name: "Скрытый вариант",
      unit: "pieces",
      material_id: 10,
      created_at: "2026-01-01T00:00:00.000Z",
      deleted_at: "2026-01-02T00:00:00.000Z",
    },
    {
      id: 103,
      name: "Фанера 4мм",
      unit: "pieces",
      material_id: 13,
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
} satisfies PageFixtures;

export const stubPageApi = (fixtures: PageFixtures = {}) => {
  const materials = fixtures.materials ?? [];
  const types = fixtures.types ?? [];
  const variants = fixtures.variants ?? [];

  const active = <T extends { deleted_at?: string | null }>(rows: T[]) =>
    rows.filter((row) => !row.deleted_at);

  const list =
    <T extends { deleted_at?: string | null }>(rows: T[]) =>
    ({ search }: { search: URLSearchParams }) =>
      search.get("hidden") === "true" ? rows : active(rows);

  return stubRoutes({
    "/api/material": { get: list(materials) },
    "/api/material-type": { get: list(types) },
    "/api/material-variant": { get: list(variants) },
    "/api/supplier": { get: () => [] },
    "/api/supply": { get: () => [] },
  });
};

export const renderPage = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          { path: "/material", element: <MaterialPage /> },
          { path: "/material/supply", element: <SupplyPage /> },
        ],
      },
    ],
    { initialEntries: ["/material"] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

export type Page = Awaited<ReturnType<typeof renderPage>>;

export const openSupplyPage = async (screen: Page) => {
  await screen.getByPlaceholder("Начать работу").click();
  await screen.getByText("Сделать поставку").click();

  const heading = screen.getByRole("heading", { name: "Поставка" });
  await expect.element(heading).toBeInTheDocument();

  return heading;
};
