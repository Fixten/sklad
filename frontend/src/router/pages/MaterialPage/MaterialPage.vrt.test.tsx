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

  await expect.element(page.getByText("Доска сосна")).toBeInTheDocument();
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

test("renders the type card page", async () => {
  stubPageApi(catalogFixtures);
  await renderPage("/materials/type/1");

  await expect
    .element(page.getByRole("heading", { name: "Древесина", level: 1 }))
    .toBeInTheDocument();
  await expect.element(page.getByText("Шпон")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the material card page", async () => {
  stubPageApi(catalogFixtures);
  await renderPage("/materials/material/10");

  await expect
    .element(page.getByRole("heading", { name: "Доска сосна", level: 1 }))
    .toBeInTheDocument();
  await expect.element(page.getByText("Остаток: 7 м")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the variant card page", async () => {
  stubPageApi(catalogFixtures);
  await renderPage("/materials/variant/100");

  await expect
    .element(page.getByRole("heading", { name: "Доска 100x20", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(page.getByText("2026-03-15 · 2.5 м · Остаток: 2.5 м"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the type edit form", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/1");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect.element(page.getByLabelText("Название")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the material edit form", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect.element(page.getByLabelText("Название")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the variant edit form", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect
    .element(page.getByRole("combobox", { name: "Единица" }))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the material create form", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await expect.element(page.getByLabelText("Название")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the catalog with hidden cards revealed", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Показать скрытые" }).click();
  await expect.element(page.getByText("Скрытый тип")).toBeInTheDocument();
  await expect.element(page.getByText("Скрытый материал")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});
