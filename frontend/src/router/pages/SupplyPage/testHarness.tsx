import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { render } from "vitest-browser-react";

import AppLayout from "@/layout/App.layout";
import { stubRoutes } from "@/test/apiStub.vitest";

import { supplyPageRoutes } from "./testFixtures";

import SupplyPage from "./index";

export const stubPageApi = () => stubRoutes(supplyPageRoutes);

export const renderPage = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/material/supply"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/material" element={<div>Материалы</div>} />
            <Route path="/material/supply" element={<SupplyPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

export type Page = Awaited<ReturnType<typeof renderPage>>;
