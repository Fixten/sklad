import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import AppLayout from "@/layout/App.layout";
import pathsRouter from "@/router/paths.router";
import { stubRoutes } from "@/test/apiStub.vitest";
import Toaster from "@ui/Toast";

import {
  type PageFixtures,
  catalogFixtures,
  pageRoutes,
  suppliesFixtures,
} from "./catalogFixtures";
import CreateMaterialPage from "./CreateMaterialPage";
import CreateTypePage from "./CreateTypePage";
import CreateVariantPage from "./CreateVariantPage";
import MaterialCardPage from "./MaterialCardPage";
import SuppliersPage from "./SuppliersPage";
import SuppliesPage from "./SuppliesPage";
import SupplyPage from "./SupplyPage";
import TypePage from "./TypePage";
import VariantPage from "./VariantPage";

import MaterialPage from "./index";

export { type PageFixtures, catalogFixtures, pageRoutes, suppliesFixtures };

export const stubPageApi = (fixtures: PageFixtures = {}) =>
  stubRoutes(pageRoutes(fixtures));

export const renderPage = async (
  initialEntry: string = pathsRouter.material,
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          { path: pathsRouter.material, element: <MaterialPage /> },
          { path: pathsRouter.materialTypeNew, element: <CreateTypePage /> },
          {
            path: pathsRouter.materialItemNew,
            element: <CreateMaterialPage />,
          },
          {
            path: pathsRouter.materialVariantNew,
            element: <CreateVariantPage />,
          },
          { path: pathsRouter.supply, element: <SupplyPage /> },
          { path: pathsRouter.supplies, element: <SuppliesPage /> },
          { path: pathsRouter.suppliers, element: <SuppliersPage /> },
          { path: pathsRouter.materialType, element: <TypePage /> },
          { path: pathsRouter.materialItem, element: <MaterialCardPage /> },
          { path: pathsRouter.materialVariant, element: <VariantPage /> },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
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
