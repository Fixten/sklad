import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import type { VariantModel } from "@/features/Variant/Variant.model";
import AppLayout from "@/layout/App.layout";
import pathsRouter from "@/router/paths.router";
import { errorResponse, stubRoutes } from "@/test/apiStub.vitest";
import Toaster from "@ui/Toast";

import MaterialCardPage from "./MaterialCardPage";
import {
  type Page,
  catalogFixtures,
  openSupplyPage,
  pageRoutes,
  renderPage,
  stubPageApi,
} from "./testHarness";
import TypePage from "./TypePage";

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

test("catalog root is /materials", async () => {
  stubPageApi();
  const screen = await renderPage();

  await expect
    .element(screen.getByRole("link", { name: "Материалы" }))
    .toHaveAttribute("href", "/materials");
});

test("opens the type page from a card title", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Типы");

  await screen.getByRole("link", { name: "Древесина" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Древесина", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Пиломатериалы")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска сосна")).toBeInTheDocument();
  await expect.element(screen.getByText("Дуб")).toBeInTheDocument();
  await expect.element(screen.getByText("Ясень")).toBeInTheDocument();
  await expect.element(screen.getByText("Шпон")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Скрытый материал"))
    .not.toBeInTheDocument();
});

test("opens the material page from a card title", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("link", { name: "Доска сосна" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска сосна", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Сорт первый")).toBeInTheDocument();
  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска 100x20")).toBeInTheDocument();
  await expect.element(screen.getByText("Остаток: 7 м")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Последняя поставка: 2026-03-15"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Скрытый вариант"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Добавить вариант" }))
    .toBeInTheDocument();
});

test("shows a hidden type as context on the material page", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("link", { name: "Фанера" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Фанера", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Скрытый тип")).toBeInTheDocument();
  await expect.element(screen.getByText("Фанера 4мм")).toBeInTheDocument();
});

test("opens the variant page from a card title", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await screen.getByRole("link", { name: "Доска 100x20" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска 100x20", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска сосна · Древесина"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Единица: метр")).toBeInTheDocument();
  await expect
    .element(screen.getByText("2026-02-01 · 4.5 м · Остаток: 4.5 м"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("2026-03-15 · 2.5 м · Остаток: 2.5 м"))
    .toBeInTheDocument();
  await expect.element(screen.getByText(/2026-01-20/)).not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Сделать поставку" }))
    .toBeInTheDocument();
});

test("shows hidden parent context on the variant page", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/103");

  await expect
    .element(screen.getByRole("heading", { name: "Фанера 4мм", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Фанера · Скрытый тип"))
    .toBeInTheDocument();
});

test("returns to the list from a card page", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");
  await expect
    .element(screen.getByRole("heading", { name: "Доска сосна", level: 1 }))
    .toBeInTheDocument();

  await screen.getByRole("link", { name: "← Материалы" }).click();

  await expect
    .element(screen.getByTestId("material-catalog-list"))
    .toBeInTheDocument();
});

test("shows not found for an unknown id", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/999999");

  await expect
    .element(screen.getByText("Запись не найдена"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("link", { name: "← Материалы" }))
    .toBeInTheDocument();
});

const expectPrefilledDoskaSupply = async (screen: Page) => {
  await expect.element(screen.getByLabelText("Тип")).toHaveValue("Древесина");
  await expect
    .element(screen.getByLabelText("Материал"))
    .toHaveValue("Доска сосна");
  await expect
    .element(screen.getByLabelText("Вариант"))
    .toHaveValue("Доска 100x20");
  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toMatchTextContent("метр");
};

test("starts a prefilled supply from a variant card", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await screen
    .getByRole("button", { name: "Сделать поставку" })
    .first()
    .click();

  await expect
    .element(screen.getByRole("heading", { name: "Поставка" }))
    .toBeInTheDocument();
  await expectPrefilledDoskaSupply(screen);
});

test("starts a prefilled supply from the material page", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");
  await expect
    .element(screen.getByRole("heading", { name: "Доска сосна", level: 1 }))
    .toBeInTheDocument();

  await screen
    .getByRole("button", { name: "Сделать поставку" })
    .first()
    .click();

  await expectPrefilledDoskaSupply(screen);
});

test("starts a prefilled supply from the variant page", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/100");
  await expect
    .element(screen.getByRole("heading", { name: "Доска 100x20", level: 1 }))
    .toBeInTheDocument();

  await screen.getByRole("button", { name: "Сделать поставку" }).click();

  await expectPrefilledDoskaSupply(screen);
});

test("prefills a supply from the variant query param", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/supply?variant=103");

  await expect
    .element(screen.getByLabelText("Тип"))
    .toHaveValue("Скрытый тип (скрыт)");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Фанера");
  await expect
    .element(screen.getByLabelText("Вариант"))
    .toHaveValue("Фанера 4мм");
  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toMatchTextContent("штука");
});

test("keeps user input when variant data arrives late", async () => {
  let resolveVariants: (rows: VariantModel[]) => void = () => undefined;
  const deferred = new Promise<VariantModel[]>((resolve) => {
    resolveVariants = resolve;
  });

  stubRoutes({
    ...pageRoutes(catalogFixtures),
    "/api/material-variant": { get: () => deferred },
  });
  const screen = await renderPage("/materials/supply?variant=100");

  await screen.getByLabelText("Количество").fill("5");

  resolveVariants(catalogFixtures.variants);

  await expect
    .element(screen.getByRole("status", { name: "Loading" }).first())
    .not.toBeInTheDocument();

  await expect.element(screen.getByLabelText("Количество")).toHaveValue(5);
  await expect.element(screen.getByLabelText("Тип")).toHaveValue("");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("");
  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

test("ignores an unknown variant id in the supply query", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/supply?variant=999999");

  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

test("ignores a non-numeric variant id in the supply query", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/supply?variant=abc");

  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

test("ignores a hidden variant id in the supply query", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/supply?variant=102");

  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

test("opens a blank supply form without a variant param", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/supply");

  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

const patchesTo = (
  requests: { method: string; path: string; body: unknown }[],
  path: string,
) =>
  requests.find(
    (request) => request.method === "PATCH" && request.path === path,
  );

test("edits a type: prefilled form, PATCH body and updated view", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/1");

  await screen.getByRole("button", { name: "Редактировать" }).click();

  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Древесина");
  await expect
    .element(screen.getByLabelText("Описание"))
    .toHaveValue("Пиломатериалы");

  await screen.getByLabelText("Название").fill("Древесина твёрдая");
  await screen.getByLabelText("Описание").fill("Твёрдые породы");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(
      screen.getByRole("heading", { name: "Древесина твёрдая", level: 1 }),
    )
    .toBeInTheDocument();
  await expect.element(screen.getByText("Твёрдые породы")).toBeInTheDocument();
  expect(patchesTo(requests, "/api/material-type/1")?.body).toEqual({
    name: "Древесина твёрдая",
    description: "Твёрдые породы",
  });
});

test("cancels a type edit without saving", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/1");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("Древесина твёрдая");
  await screen.getByRole("button", { name: "Отмена" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Древесина", level: 1 }))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("rejects an empty type name without saving", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/1");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("   ");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Укажите название"))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("shows a mapped server error and keeps values on a failed type save", async () => {
  const requests = stubRoutes({
    ...pageRoutes(catalogFixtures),
    "/api/material-type/{id}": {
      patch: () => errorResponse(409, "Name already exists"),
    },
  });
  const screen = await renderPage("/materials/type/1");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("Металл");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Такое имя уже занято."))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Название")).toHaveValue("Металл");
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    1,
  );
});

test("edits a material: prefilled form, PATCH body and updated view", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();

  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Доска сосна");
  await expect
    .element(screen.getByLabelText("Описание"))
    .toHaveValue("Сорт первый");
  await expect
    .element(screen.getByRole("combobox", { name: "Тип" }))
    .toMatchTextContent("Древесина");

  await screen.getByLabelText("Название").fill("Доска липа");
  await screen.getByLabelText("Описание").fill("");
  await screen.getByRole("combobox", { name: "Тип" }).click();
  await screen.getByRole("option", { name: "Металл" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска липа", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Металл")).toBeInTheDocument();
  expect(patchesTo(requests, "/api/material/10")?.body).toEqual({
    name: "Доска липа",
    description: null,
    material_type_id: 2,
  });
});

test("cancels a material edit without saving", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("Доска липа");
  await screen.getByRole("button", { name: "Отмена" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска сосна", level: 1 }))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("rejects an empty material name without saving", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Укажите название"))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("rejects a material edit without an available type", async () => {
  const requests = stubPageApi({
    ...catalogFixtures,
    types: catalogFixtures.types.filter((type) => type.id !== 1),
  });
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect.element(screen.getByText("Выберите тип")).toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("keeps a hidden type selectable but omits it from the PATCH", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/13");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Тип" }))
    .toMatchTextContent("Скрытый тип (скрыт)");

  await screen.getByLabelText("Название").fill("Фанера берёзовая");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  expect(patchesTo(requests, "/api/material/13")?.body).toEqual({
    name: "Фанера берёзовая",
    description: null,
  });
});

test("keeps a hidden material selectable but omits it from a variant PATCH", async () => {
  const requests = stubPageApi({
    ...catalogFixtures,
    variants: [
      ...catalogFixtures.variants,
      {
        id: 107,
        name: "Скрытый шпон",
        unit: "pieces",
        material_id: 12,
        created_at: "2026-01-01T00:00:00.000Z",
      },
    ],
  });
  const screen = await renderPage("/materials/variant/107");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Материал" }))
    .toMatchTextContent("Скрытый материал (скрыт)");

  await screen.getByLabelText("Название").fill("Скрытый шпон 2");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Скрытый шпон 2", level: 1 }))
    .toBeInTheDocument();
  expect(patchesTo(requests, "/api/material-variant/107")?.body).toEqual({
    name: "Скрытый шпон 2",
    unit: "pieces",
  });
});

test("omits the unit from the PATCH when the detail cannot be loaded", async () => {
  const routes = pageRoutes(catalogFixtures);
  const requests = stubRoutes({
    ...routes,
    "/api/material-variant/{id}": {
      get: () => errorResponse(500, "Variant unavailable"),
      patch: routes["/api/material-variant/{id}"].patch,
    },
  });
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();

  await expect
    .element(screen.getByText("Не удалось проверить единицу"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("combobox", { name: "Единица" }))
    .toBeDisabled();

  await screen.getByLabelText("Название").fill("Доска 100x25");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска 100x25", level: 1 }))
    .toBeInTheDocument();
  expect(patchesTo(requests, "/api/material-variant/100")?.body).toEqual({
    name: "Доска 100x25",
  });
});

test("prefills freshly saved values on a quick re-edit", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("Доска липа");
  await screen.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .element(screen.getByRole("heading", { name: "Доска липа", level: 1 }))
    .toBeInTheDocument();

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Доска липа");
});

test("shows a mapped server error and keeps values on a failed material save", async () => {
  const requests = stubRoutes({
    ...pageRoutes(catalogFixtures),
    "/api/material/{id}": {
      patch: () => errorResponse(409, "Name already exists"),
    },
  });
  const screen = await renderPage("/materials/material/10");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("Металл");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Такое имя уже занято."))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Название")).toHaveValue("Металл");
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    1,
  );
});

test("edits a variant: prefilled form, PATCH body and updated view", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();

  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Доска 100x20");
  await expect
    .element(screen.getByRole("combobox", { name: "Материал" }))
    .toMatchTextContent("Доска сосна");
  await expect
    .element(screen.getByRole("combobox", { name: "Единица" }))
    .toMatchTextContent("метр");

  await screen.getByLabelText("Название").fill("Доска 100x25");
  await screen.getByRole("combobox", { name: "Единица" }).click();
  await screen.getByRole("option", { name: "штука" }).click();
  await screen.getByRole("combobox", { name: "Материал" }).click();
  await screen.getByRole("option", { name: "Болт" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска 100x25", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Болт · Металл")).toBeInTheDocument();
  await expect.element(screen.getByText("Единица: штука")).toBeInTheDocument();
  expect(patchesTo(requests, "/api/material-variant/100")?.body).toEqual({
    name: "Доска 100x25",
    unit: "pieces",
    material_id: 11,
  });
});

test("cancels a variant edit without saving", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("Доска 100x25");
  await screen.getByRole("button", { name: "Отмена" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска 100x20", level: 1 }))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("rejects an empty variant name without saving", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByLabelText("Название").fill("");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Укажите название"))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("rejects a variant edit without an available material", async () => {
  const requests = stubPageApi({
    ...catalogFixtures,
    materials: catalogFixtures.materials.filter(
      (material) => material.id !== 10,
    ),
  });
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите материал"))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    0,
  );
});

test("shows a mapped server error and keeps values on a failed variant save", async () => {
  const routes = pageRoutes(catalogFixtures);
  const requests = stubRoutes({
    ...routes,
    "/api/material-variant/{id}": {
      get: routes["/api/material-variant/{id}"].get,
      patch: () => errorResponse(409, "Name already exists"),
    },
  });
  const screen = await renderPage("/materials/variant/100");

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Единица" }))
    .toMatchTextContent("метр");
  await screen.getByLabelText("Название").fill("Брусок 100");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Такое имя уже занято."))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Брусок 100");
  expect(requests.filter((request) => request.method === "PATCH")).toHaveLength(
    1,
  );
});

test("fetches the unit lock on edit and omits a locked unit from the PATCH", async () => {
  const requests = stubPageApi({ ...catalogFixtures, unitLocked: true });
  const screen = await renderPage("/materials/variant/100");

  expect(
    requests.some((request) => request.path === "/api/material-variant/100"),
  ).toBe(false);

  await screen.getByRole("button", { name: "Редактировать" }).click();

  await expect
    .element(screen.getByText("Единицу нельзя изменить"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("combobox", { name: "Единица" }))
    .toBeDisabled();
  expect(
    requests.some((request) => request.path === "/api/material-variant/100"),
  ).toBe(true);

  await screen.getByLabelText("Название").fill("Доска 200x40");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Доска 200x40", level: 1 }))
    .toBeInTheDocument();
  expect(patchesTo(requests, "/api/material-variant/100")?.body).toEqual({
    name: "Доска 200x40",
  });
});

test("renames a hidden type without changing other fields", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/3");

  await screen.getByRole("button", { name: "Переименовать" }).click();
  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Скрытый тип");
  await expect
    .element(screen.getByLabelText("Описание"))
    .not.toBeInTheDocument();

  await screen.getByLabelText("Название").fill("Скрытый тип 2");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  expect(patchesTo(requests, "/api/material-type/3")?.body).toEqual({
    name: "Скрытый тип 2",
  });
});

test("renames a hidden material without changing other fields", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/12");

  await screen.getByRole("button", { name: "Переименовать" }).click();
  await expect
    .element(screen.getByLabelText("Описание"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("combobox", { name: "Тип" }))
    .not.toBeInTheDocument();

  await screen.getByLabelText("Название").fill("Скрытый материал 2");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  expect(patchesTo(requests, "/api/material/12")?.body).toEqual({
    name: "Скрытый материал 2",
  });
});

test("renames a hidden variant without changing other fields", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/variant/102");

  await screen.getByRole("button", { name: "Переименовать" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Единица" }))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("combobox", { name: "Материал" }))
    .not.toBeInTheDocument();

  await screen.getByLabelText("Название").fill("Скрытый вариант 2");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  expect(patchesTo(requests, "/api/material-variant/102")?.body).toEqual({
    name: "Скрытый вариант 2",
  });
});

const postsTo = (
  requests: { method: string; path: string; body: unknown }[],
  path: string,
) =>
  requests.find(
    (request) => request.method === "POST" && request.path === path,
  );

test("offers an add action matching each catalog level and resets form on level change", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await expect
    .element(screen.getByRole("button", { name: "Добавить материал" }))
    .toBeInTheDocument();
  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await expect.element(screen.getByLabelText("Название")).toBeInTheDocument();

  await switchLevel(screen, "Варианты");
  await expect
    .element(screen.getByLabelText("Название"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Добавить вариант" }))
    .toBeInTheDocument();

  await switchLevel(screen, "Типы");
  await expect
    .element(screen.getByRole("button", { name: "Добавить тип" }))
    .toBeInTheDocument();
});

test("creates a type from the types list and opens its page", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Типы");

  await screen.getByRole("button", { name: "Добавить тип" }).click();
  await screen.getByLabelText("Название").fill("Пластик");
  await screen.getByLabelText("Описание").fill("Листовой");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Пластик", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Листовой")).toBeInTheDocument();
  expect(postsTo(requests, "/api/material-type")?.body).toEqual({
    name: "Пластик",
    description: "Листовой",
  });
});

test("creates a material from the materials list and opens its page", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await screen.getByLabelText("Название").fill("Кедр");
  await screen.getByLabelText("Описание").fill("Сибирский");
  await screen.getByRole("combobox", { name: "Тип" }).click();
  await screen.getByRole("option", { name: "Древесина" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Кедр", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Сибирский")).toBeInTheDocument();
  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  expect(postsTo(requests, "/api/material")?.body).toEqual({
    name: "Кедр",
    description: "Сибирский",
    material_type_id: 1,
  });
});

test("creates a variant from the variants list and opens its page", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage();
  await switchLevel(screen, "Варианты");

  await screen.getByRole("button", { name: "Добавить вариант" }).click();
  await screen.getByLabelText("Название").fill("Гайка М8");
  await screen.getByRole("combobox", { name: "Единица" }).click();
  await screen.getByRole("option", { name: "штука" }).click();
  await screen.getByRole("combobox", { name: "Материал" }).click();
  await screen.getByRole("option", { name: "Болт" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Гайка М8", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Единица: штука")).toBeInTheDocument();
  await expect.element(screen.getByText("Болт · Металл")).toBeInTheDocument();
  expect(postsTo(requests, "/api/material-variant")?.body).toEqual({
    name: "Гайка М8",
    unit: "pieces",
    material_id: 11,
  });
});

test("creates a material from a type page with the type prefilled", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/type/2");

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Тип" }))
    .toMatchTextContent("Металл");

  await screen.getByLabelText("Название").fill("Шайба");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Шайба", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Металл")).toBeInTheDocument();
  expect(postsTo(requests, "/api/material")?.body).toEqual({
    name: "Шайба",
    description: null,
    material_type_id: 2,
  });
});

test("creates a variant from a material page with the material prefilled", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage("/materials/material/11");

  await screen.getByRole("button", { name: "Добавить вариант" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Материал" }))
    .toMatchTextContent("Болт");

  await screen.getByLabelText("Название").fill("Болт М10");
  await screen.getByRole("combobox", { name: "Единица" }).click();
  await screen.getByRole("option", { name: "штука" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Болт М10", level: 1 }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Болт · Металл")).toBeInTheDocument();
  expect(postsTo(requests, "/api/material-variant")?.body).toEqual({
    name: "Болт М10",
    unit: "pieces",
    material_id: 11,
  });
});

test("excludes hidden parents when creating and hides add button on hidden parent pages", async () => {
  stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await screen.getByRole("combobox", { name: "Тип" }).click();
  await expect
    .element(screen.getByRole("option", { name: "Древесина" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Скрытый тип/ }))
    .not.toBeInTheDocument();
  await userEvent.keyboard("{Escape}");

  await switchLevel(screen, "Варианты");
  await screen.getByRole("button", { name: "Добавить вариант" }).click();
  await screen.getByRole("combobox", { name: "Материал" }).click();
  await expect
    .element(screen.getByRole("option", { name: "Доска сосна" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Скрытый материал/ }))
    .not.toBeInTheDocument();
  await userEvent.keyboard("{Escape}");

  const hiddenTypeScreen = await renderPage("/materials/type/3");
  await expect
    .element(
      hiddenTypeScreen.getByRole("heading", { name: "Скрытый тип", level: 1 }),
    )
    .toBeInTheDocument();
  await expect
    .element(
      hiddenTypeScreen.getByRole("button", { name: "Добавить материал" }),
    )
    .not.toBeInTheDocument();

  const hiddenMaterialScreen = await renderPage("/materials/material/12");
  await expect
    .element(
      hiddenMaterialScreen.getByRole("heading", {
        name: "Скрытый материал",
        level: 1,
      }),
    )
    .toBeInTheDocument();
  await expect
    .element(
      hiddenMaterialScreen.getByRole("button", { name: "Добавить вариант" }),
    )
    .not.toBeInTheDocument();
});

test("cancels creating from the catalog without sending a POST", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await screen.getByLabelText("Название").fill("Черновик");
  await screen.getByRole("button", { name: "Отмена" }).click();

  await expect
    .element(screen.getByLabelText("Название"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Добавить материал" }))
    .toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toHaveLength(
    0,
  );
});

test("validates required create fields without sending a POST", async () => {
  const requests = stubPageApi(catalogFixtures);
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Укажите название"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Выберите тип")).toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toHaveLength(
    0,
  );
});

test("shows the hidden-holder error message and preserves values on a 409 create", async () => {
  const routes = pageRoutes(catalogFixtures);
  const requests = stubRoutes({
    ...routes,
    "/api/material-type": {
      get: routes["/api/material-type"].get,
      post: () => errorResponse(409, "Name is reserved by a hidden record"),
    },
  });
  const screen = await renderPage();
  await switchLevel(screen, "Типы");

  await screen.getByRole("button", { name: "Добавить тип" }).click();
  await screen.getByLabelText("Название").fill("Скрытый тип");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Скрыто, восстановите, чтобы продолжить."))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название"))
    .toHaveValue("Скрытый тип");
  expect(requests.filter((request) => request.method === "POST")).toHaveLength(
    1,
  );
});

test("resets open create and edit forms when the route :id changes", async () => {
  stubPageApi(catalogFixtures);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [
          { path: pathsRouter.materialType, element: <TypePage /> },
          { path: pathsRouter.materialItem, element: <MaterialCardPage /> },
        ],
      },
    ],
    { initialEntries: ["/materials/type/1"] },
  );
  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>,
  );

  await screen.getByRole("button", { name: "Добавить материал" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Тип" }))
    .toMatchTextContent("Древесина");

  await router.navigate("/materials/type/2");
  await expect
    .element(screen.getByRole("heading", { name: "Металл", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Добавить материал" }))
    .toBeInTheDocument();

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect.element(screen.getByLabelText("Название")).toHaveValue("Металл");

  await router.navigate("/materials/type/1");
  await expect
    .element(screen.getByRole("heading", { name: "Древесина", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название"))
    .not.toBeInTheDocument();

  await router.navigate("/materials/material/10");
  await screen.getByRole("button", { name: "Добавить вариант" }).click();
  await expect
    .element(screen.getByRole("combobox", { name: "Материал" }))
    .toMatchTextContent("Доска сосна");

  await router.navigate("/materials/material/11");
  await expect
    .element(screen.getByRole("heading", { name: "Болт", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Добавить вариант" }))
    .toBeInTheDocument();

  await screen.getByRole("button", { name: "Редактировать" }).click();
  await expect.element(screen.getByLabelText("Название")).toHaveValue("Болт");

  await router.navigate("/materials/material/10");
  await expect
    .element(screen.getByRole("heading", { name: "Доска сосна", level: 1 }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название"))
    .not.toBeInTheDocument();
});
