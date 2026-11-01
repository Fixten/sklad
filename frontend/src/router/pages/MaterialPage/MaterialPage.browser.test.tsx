import { expect, test } from "vitest";

import { openSupplyPage, renderPage, stubPageApi } from "./testHarness";

test("renders only the palette line at rest", async () => {
  stubPageApi();
  const screen = await renderPage();

  await expect
    .element(screen.getByPlaceholder("Начать работу"))
    .toBeInTheDocument();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("opens the actions palette with the supply action", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByPlaceholder("Начать работу").click();

  await expect
    .element(screen.getByRole("listbox", { name: "Действия" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Сделать поставку"))
    .toBeInTheDocument();
});

test("opens the supply page from the supply action", async () => {
  stubPageApi();
  const screen = await renderPage();

  await openSupplyPage(screen);

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});
