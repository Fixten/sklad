import { expect, test } from "vitest";
import { page } from "vitest/browser";

import { catalogFixtures, renderPage, stubPageApi } from "./testHarness";

const viewport = () => page.elementLocator(document.body);

test("renders the page with the palette at rest", async () => {
  stubPageApi();
  await renderPage();

  await expect
    .element(page.getByPlaceholder("Начать работу"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the catalog with cards", async () => {
  stubPageApi(catalogFixtures);
  await renderPage();

  await expect.element(page.getByText("Доска 100x20")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the open actions palette", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByPlaceholder("Начать работу").click();
  await expect
    .element(screen.getByText("Сделать поставку"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});
