import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import AppLayout from "@/layout/App.layout";
import { stubRoutes } from "@/test/apiStub.vitest";

import SupplyPage from "./SupplyPage";

import MaterialPage from "./index";

export const stubPageApi = () =>
  stubRoutes({
    "/api/material": { get: () => [] },
    "/api/material-type": { get: () => [] },
    "/api/material-variant": { get: () => [] },
    "/api/supplier": { get: () => [] },
    "/api/supply": { get: () => [] },
  });

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
