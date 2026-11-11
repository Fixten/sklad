import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { render } from "vitest-browser-react";

import { supplyPageRoutes } from "@/features/Supply/testFixtures";
import AppLayout from "@/layout/App.layout";
import { stubRoutes } from "@/test/apiStub.vitest";

import SupplyPage from "./index";

export const stubPageApi = () => stubRoutes(supplyPageRoutes);

export const renderPage = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          { path: "/material", element: <div>Материалы</div> },
          { path: "/material/supply", element: <SupplyPage /> },
        ],
      },
    ],
    { initialEntries: ["/material/supply"] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
};

export type Page = Awaited<ReturnType<typeof renderPage>>;
