import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import pathsRouter from "@/router/paths.router";

import {
  catalogFixtures,
  renderPage,
  stubPageApi,
  suppliesFixtures,
} from "../testHarness";

test("renders every supply with its context, quantity, cost, supplier, url and date", async () => {
  stubPageApi(suppliesFixtures);
  const screen = await renderPage(pathsRouter.supplies);

  await expect
    .element(screen.getByRole("heading", { name: "Поставки" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Древесина · Доска сосна · Доска 100x20").first())
    .toBeInTheDocument();
  await expect.element(screen.getByText("Доска для пола")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Количество: 4.5 м · Остаток: 4.5 м"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Цена за единицу: 100 ₽ / м"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Поставщик: Столярный двор"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Дата: 2026-02-01"))
    .toBeInTheDocument();

  const link = screen.getByRole("link", { name: "Ссылка" });
  await expect
    .element(link)
    .toHaveAttribute("href", "https://example.com/supplies/200");
  await expect.element(link).toHaveAttribute("target", "_blank");

  await expect
    .element(screen.getByText("Металл · Болт · Саморез 35"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Количество: 10 шт · Остаток: 8 шт"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Цена за единицу: 10 ₽ / шт"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Поставщик: Лесная база"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Дата: 2026-03-15"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("link", { name: "Доска 100x20" }))
    .not.toBeInTheDocument();
});

test("filters to one variant with its title, stock and a clear-control", async () => {
  stubPageApi(suppliesFixtures);
  const screen = await renderPage(`${pathsRouter.supplies}?variant=100`);

  await expect
    .element(screen.getByRole("heading", { name: "Поставки — Доска 100x20" }))
    .toBeInTheDocument();
  await expect.element(screen.getByText("Остаток: 7 м")).toBeInTheDocument();
  await expect.element(screen.getByText("Доска для пола")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .not.toBeInTheDocument();

  const clear = screen.getByRole("link", { name: "Все поставки" });
  await expect.element(clear).toHaveAttribute("href", pathsRouter.supplies);
  await clear.click();

  await expect
    .element(screen.getByRole("heading", { name: "Поставки" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .toBeInTheDocument();
});

test("hides the clear-control when viewing all supplies", async () => {
  stubPageApi(suppliesFixtures);
  const screen = await renderPage(pathsRouter.supplies);

  await expect
    .element(screen.getByRole("link", { name: "Все поставки" }))
    .not.toBeInTheDocument();
});

test("searches supplies by description", async () => {
  stubPageApi(suppliesFixtures);
  const screen = await renderPage(pathsRouter.supplies);

  await userEvent.type(screen.getByLabelText("Поиск"), "ДЛЯ ПОЛА");

  await expect.element(screen.getByText("Доска для пола")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .not.toBeInTheDocument();
});

test("searches supplies by supplier name", async () => {
  stubPageApi(suppliesFixtures);
  const screen = await renderPage(pathsRouter.supplies);

  await userEvent.type(screen.getByLabelText("Поиск"), "лесная");

  await expect
    .element(screen.getByText("Цена за единицу: 10 ₽ / шт"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска для пола"))
    .not.toBeInTheDocument();
});

test("searches supplies by variant, material and type names", async () => {
  stubPageApi(suppliesFixtures);
  const screen = await renderPage(pathsRouter.supplies);
  const input = screen.getByLabelText("Поиск");

  await userEvent.type(input, "саморез");
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска для пола"))
    .not.toBeInTheDocument();

  await userEvent.clear(input);
  await userEvent.type(input, "болт");
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска для пола"))
    .not.toBeInTheDocument();

  await userEvent.clear(input);
  await userEvent.type(input, "металл");
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Доска для пола"))
    .not.toBeInTheDocument();

  await userEvent.clear(input);
  await userEvent.type(input, "древесина");
  await expect.element(screen.getByText("Доска для пола")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Саморезы для сборки"))
    .not.toBeInTheDocument();
});

test("offers to create the first supply from an empty list", async () => {
  stubPageApi({ ...catalogFixtures, supplies: [] });
  const screen = await renderPage(pathsRouter.supplies);

  await expect.element(screen.getByText("Поставок нет")).toBeInTheDocument();
  await expect
    .element(screen.getByRole("link", { name: "Сделать поставку" }))
    .toHaveAttribute("href", pathsRouter.supply);
});

test("keeps the variant in the create link from an empty filtered list", async () => {
  stubPageApi({ ...catalogFixtures, supplies: [] });
  const screen = await renderPage(`${pathsRouter.supplies}?variant=101`);

  await expect.element(screen.getByText("Поставок нет")).toBeInTheDocument();
  await expect.element(screen.getByText("Остаток: 0 шт")).toBeInTheDocument();
  await expect
    .element(screen.getByRole("link", { name: "Сделать поставку" }))
    .toHaveAttribute("href", `${pathsRouter.supply}?variant=101`);
});
