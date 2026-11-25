import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { errorResponse, stubRoutes } from "@/test/apiStub.vitest";

import {
  type Page,
  catalogFixtures,
  openSupplyPage,
  pageRoutes,
  renderPage,
  stubPageApi,
} from "./testHarness";

const switchLevel = async (screen: Page, label: string) => {
  await screen.getByRole("combobox", { name: "Уровень" }).click();
  await screen.getByRole("option", { name: label }).click();
};

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

test("uses Материалы as the default level", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect
    .element(
      screen.getByRole("combobox", { name: "Уровень" }).getByText("Материалы"),
    )
    .toBeInTheDocument();
  await expect.element(screen.getByText("Доска сосна")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска сосна · Древесина"))
    .not.toBeInTheDocument();
});

test("renders material cards with description, type and child summary", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect.element(screen.getByText("Сорт первый")).toBeInTheDocument();
  await expect.element(screen.getByText("Варианты: 4")).toBeInTheDocument();
  await expect
    .element(
      screen.getByText("Доска 100x20, Доска 150x30, Брусок 50x50 и ещё 1"),
    )
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Скрытый вариант"))
    .not.toBeInTheDocument();
  await expect.element(screen.getByText("Скрытый тип")).toBeInTheDocument();
});

test("renders variant cards with context, stock and last supply", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await expect.element(screen.getByText("Доска 100x20")).toBeInTheDocument();
  await expect.element(screen.getByText("Саморез 35")).toBeInTheDocument();
  await expect.element(screen.getByText("Фанера 4мм")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска сосна · Древесина").first())
    .toBeInTheDocument();
  await expect.element(screen.getByText("Болт · Металл")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Фанера · Скрытый тип"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Скрытый вариант"))
    .not.toBeInTheDocument();

  await expect.element(screen.getByText("Остаток: 7 м")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Последняя поставка: 2026-03-15"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Остаток: 0 шт").first())
    .toBeInTheDocument();
  expect(screen.getByText(/Последняя поставка/).all()).toHaveLength(2);
});

test("rounds stock to three decimals on the card", async () => {
  stubPageApi({
    ...catalogFixtures,
    supplies: [
      {
        id: 300,
        material_variant_id: 100,
        unit: "meters",
        quantity: 0.1,
        remaining_quantity: 0.1,
        purchase_price: 100,
        unit_purchase_cost: 100,
        created_at: "2026-02-01T00:00:00.000Z",
      },
      {
        id: 301,
        material_variant_id: 100,
        unit: "meters",
        quantity: 0.2,
        remaining_quantity: 0.2,
        purchase_price: 100,
        unit_purchase_cost: 100,
        created_at: "2026-03-01T00:00:00.000Z",
      },
    ],
  });
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await expect.element(screen.getByText("Остаток: 0.3 м")).toBeInTheDocument();
});

test("reports rejected supplies with an error toast", async () => {
  stubRoutes({
    ...pageRoutes(catalogFixtures),
    "/api/supply": {
      get: () => errorResponse(400, "Supplies unavailable"),
    },
  });
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await expect.element(screen.getByText("Доска 100x20")).toBeInTheDocument();
  await expect.element(screen.getByText("Саморез 35")).toBeInTheDocument();
  await expect.element(screen.getByText("Фанера 4мм")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Не удалось загрузить данные"))
    .toBeVisible();
  expect(screen.getByText("Не удалось загрузить данные").all()).toHaveLength(1);
  await expect
    .element(screen.getByText("Остаток: нет данных").first())
    .not.toBeInTheDocument();
});

test("renders type cards with description and material summary", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Типы");

  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  await expect.element(screen.getByText("Пиломатериалы")).toBeInTheDocument();
  await expect.element(screen.getByText("Металл")).toBeInTheDocument();
  await expect.element(screen.getByText("Материалы: 4")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска сосна, Дуб, Ясень и ещё 1"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Скрытый тип")).not.toBeInTheDocument();
});

test("never renders hidden rows on any level", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect
    .element(screen.getByText("Скрытый материал"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Скрытый вариант"))
    .not.toBeInTheDocument();

  await switchLevel(screen, "Варианты");
  await expect
    .element(screen.getByText("Скрытый вариант"))
    .not.toBeInTheDocument();

  await switchLevel(screen, "Типы");
  await expect.element(screen.getByText("Скрытый тип")).not.toBeInTheDocument();
});

test("filters materials by child variant name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await userEvent.type(screen.getByLabelText("Поиск"), "саморез");

  await expect.element(screen.getByText("Болт")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска сосна")).not.toBeInTheDocument();
});

test("finds a material by a summarized child variant name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await userEvent.type(screen.getByLabelText("Поиск"), "шуруп");

  await expect.element(screen.getByText("Доска сосна")).toBeInTheDocument();
  await expect.element(screen.getByText("Болт")).not.toBeInTheDocument();
});

test("filters materials by own name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await userEvent.type(screen.getByLabelText("Поиск"), "болт");

  await expect.element(screen.getByText("Болт")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска сосна")).not.toBeInTheDocument();
});

test("filters materials by type name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await userEvent.type(screen.getByLabelText("Поиск"), "металл");

  await expect.element(screen.getByText("Болт")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска сосна")).not.toBeInTheDocument();
});

test("filters variants by own name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await userEvent.type(screen.getByLabelText("Поиск"), "саморез");

  await expect.element(screen.getByText("Саморез 35")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска 100x20"))
    .not.toBeInTheDocument();
  await expect.element(screen.getByText("Фанера 4мм")).not.toBeInTheDocument();
});

test("filters variants by material name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await userEvent.type(screen.getByLabelText("Поиск"), "доска");

  await expect.element(screen.getByText("Доска 100x20")).toBeInTheDocument();
  await expect.element(screen.getByText("Саморез 35")).not.toBeInTheDocument();
});

test("filters variants by type name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await userEvent.type(screen.getByLabelText("Поиск"), "металл");

  await expect.element(screen.getByText("Саморез 35")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска 100x20"))
    .not.toBeInTheDocument();
});

test("filters variants by hidden parent type name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await userEvent.type(screen.getByLabelText("Поиск"), "скрытый");

  await expect.element(screen.getByText("Фанера 4мм")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска 100x20"))
    .not.toBeInTheDocument();
});

test("filters types by own name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Типы");

  await userEvent.type(screen.getByLabelText("Поиск"), "металл");

  await expect.element(screen.getByText("Металл")).toBeInTheDocument();
  await expect.element(screen.getByText("Древесина")).not.toBeInTheDocument();
});

test("filters types by child material name", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Типы");

  await userEvent.type(screen.getByLabelText("Поиск"), "шпон");

  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  await expect.element(screen.getByText("Металл")).not.toBeInTheDocument();
});

test("shows empty state when search has no matches", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await userEvent.type(screen.getByLabelText("Поиск"), "zzzz");

  await expect
    .element(screen.getByTestId("material-catalog-empty"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Каталог пуст")).toBeInTheDocument();
});

test("clears search and restores all default rows", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  const input = screen.getByLabelText("Поиск");

  await userEvent.type(input, "саморез");
  await expect.element(screen.getByText("Доска сосна")).not.toBeInTheDocument();

  await userEvent.clear(input);

  await expect.element(screen.getByText("Доска сосна")).toBeInTheDocument();
  await expect.element(screen.getByText("Болт")).toBeInTheDocument();
  await expect.element(screen.getByText("Фанера")).toBeInTheDocument();
});
