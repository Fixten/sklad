import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import AppLayout from "@/layout/App.layout";
import SupplyPage from "@/router/pages/SupplyPage";
import { stubRoutes } from "@/test/apiStub.vitest";

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

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/material"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/material" element={<MaterialPage />} />
            <Route path="/material/supply" element={<SupplyPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
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
