import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import { stubRoutes } from "@/test/apiStub.vitest";

import SupplySheetHarness from "./SupplySheetHarness";
import { fullCatalog, supplySheetRoutes } from "./testFixtures";


export { emptyCatalog, fullCatalog } from "./testFixtures";
export type { StubOptions } from "./testFixtures";

export const stubApi = (catalog = fullCatalog, options = {}) =>
  stubRoutes(supplySheetRoutes(catalog, options));

export const renderSheet = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SupplySheetHarness />
    </QueryClientProvider>,
  );
};

export type SheetPage = Awaited<ReturnType<typeof renderSheet>>;

export const openSheet = async (screen: SheetPage) => {
  await screen.getByRole("button", { name: "Открыть поставку" }).click();

  const dialog = screen.getByRole("dialog");
  await expect.element(dialog).toBeInTheDocument();

  return dialog;
};

export const openDetails = async (screen: SheetPage) => {
  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByRole("option", { name: /Доска 40 мм/ }).click();
  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
};

export const selectSupplier = async (screen: SheetPage, name: string) => {
  await screen.getByLabelText("Поставщик").fill(name);
  await screen.getByRole("option", { name: new RegExp(name) }).click();
};

export const fillDetails = async (screen: SheetPage) => {
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await selectSupplier(screen, "Столярный двор");
};
