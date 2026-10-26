import { expect, test } from "vitest";
import { page } from "vitest/browser";

import { renderPage, stubPageApi } from "./testHarness";

const viewport = () => page.elementLocator(document.body);

test("renders the page with the palette at rest", async () => {
  stubPageApi();
  await renderPage();

  await expect
    .element(page.getByPlaceholder("Начать работу"))
    .toBeInTheDocument();
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
