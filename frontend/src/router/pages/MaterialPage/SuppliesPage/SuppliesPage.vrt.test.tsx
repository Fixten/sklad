import { expect, test } from "vitest";
import { page } from "vitest/browser";

import pathsRouter from "@/router/paths.router";

import {
  catalogFixtures,
  renderPage,
  stubPageApi,
  suppliesFixtures,
} from "../testHarness";

const viewport = () => page.elementLocator(document.body);

test("renders all supplies", async () => {
  stubPageApi(suppliesFixtures);
  await renderPage(pathsRouter.supplies);

  await expect.element(page.getByText("Доска для пола")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders one variant's supplies", async () => {
  stubPageApi(suppliesFixtures);
  await renderPage(`${pathsRouter.supplies}?variant=100`);

  await expect
    .element(page.getByRole("heading", { name: "Поставки — Доска 100x20" }))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the empty state", async () => {
  stubPageApi({ ...catalogFixtures, supplies: [] });
  await renderPage(pathsRouter.supplies);

  await expect.element(page.getByText("Поставок нет")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});
