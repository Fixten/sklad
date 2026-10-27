import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import AppLayout from "@/layout/App.layout";
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
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

export type Page = Awaited<ReturnType<typeof renderPage>>;

export const openSheet = async (screen: Page) => {
  await screen.getByPlaceholder("Начать работу").click();
  await screen.getByText("Сделать поставку").click();

  const dialog = screen.getByRole("dialog");
  await expect.element(dialog).toBeInTheDocument();

  return dialog;
};
