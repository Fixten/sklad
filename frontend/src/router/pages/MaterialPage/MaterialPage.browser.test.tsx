import { expect, test } from "vitest";

import {
  catalogFixtures,
  openSupplyPage,
  renderPage,
  stubPageApi,
} from "./testHarness";

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

test("renders the catalog list area with an empty state", async () => {
  stubPageApi();
  const screen = await renderPage();

  await expect
    .element(screen.getByTestId("material-catalog-list"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByTestId("material-catalog-empty"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Каталог пуст")).toBeInTheDocument();
});

test("renders variant cards with context by default", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect.element(screen.getByText("Доска 100x20")).toBeInTheDocument();
  await expect.element(screen.getByText("Саморез 35")).toBeInTheDocument();
  await expect.element(screen.getByText("Фанера 4мм")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска сосна · Древесина"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Болт · Металл")).toBeInTheDocument();
  await expect
    .element(screen.getByTestId("material-catalog-empty"))
    .not.toBeInTheDocument();
});

test("shows the hidden type name as the variant context", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect
    .element(screen.getByText("Фанера · Скрытый тип"))
    .toBeInTheDocument();
});

test("renders material cards with description and type context", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("combobox", { name: "Уровень" }).click();
  await screen.getByRole("option", { name: "Материалы" }).click();

  await expect.element(screen.getByText("Доска сосна")).toBeInTheDocument();
  await expect.element(screen.getByText("Сорт первый")).toBeInTheDocument();
  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  await expect.element(screen.getByText("Болт")).toBeInTheDocument();
  await expect.element(screen.getByText("Металл")).toBeInTheDocument();
  await expect.element(screen.getByText("Фанера")).toBeInTheDocument();
  await expect.element(screen.getByText("Скрытый тип")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска 100x20"))
    .not.toBeInTheDocument();
});

test("renders type cards with description", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("combobox", { name: "Уровень" }).click();
  await screen.getByRole("option", { name: "Типы" }).click();

  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  await expect.element(screen.getByText("Пиломатериалы")).toBeInTheDocument();
  await expect.element(screen.getByText("Металл")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска сосна")).not.toBeInTheDocument();
});

test("never renders hidden rows on any level", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect.element(screen.getByText("Доска 100x20")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Скрытый вариант"))
    .not.toBeInTheDocument();

  await screen.getByRole("combobox", { name: "Уровень" }).click();
  await screen.getByRole("option", { name: "Материалы" }).click();
  await expect
    .element(screen.getByText("Скрытый материал"))
    .not.toBeInTheDocument();

  await screen.getByRole("combobox", { name: "Уровень" }).click();
  await screen.getByRole("option", { name: "Типы" }).click();
  await expect.element(screen.getByText("Скрытый тип")).not.toBeInTheDocument();
});
