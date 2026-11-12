import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import type { Routes } from "@/test/apiStub";

import { createdAt, supplyPageRoutes } from "../../testFixtures";
import { renderSupply, selectDoska } from "../testHarness";

import TargetFields from ".";

const hiddenType = {
  id: 1,
  name: "Металл",
  created_at: createdAt,
  deleted_at: createdAt,
};

const hiddenTypeRoutes = {
  ...supplyPageRoutes,
  "/api/material-type": {
    get: ({ search }: { search: URLSearchParams }) =>
      search.get("hidden") === "true" ? [hiddenType] : [],
  },
} satisfies Routes;

test("fills the target pickers from the search selection", async () => {
  const screen = await renderSupply(<TargetFields />);

  await selectDoska(screen);

  await expect
    .element(screen.getByLabelText("Тип"))
    .toHaveValue("Пиломатериал");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Дуб");
  await expect
    .element(screen.getByLabelText("Вариант"))
    .toHaveValue("Доска 40 мм");
  await expect.element(screen.getByText("метр")).toBeInTheDocument();
});

test("shows the linked material in the manual picker after a selection", async () => {
  const screen = await renderSupply(<TargetFields />);

  await selectDoska(screen);
  await screen.getByLabelText("Материал").click();

  await expect
    .element(screen.getByRole("option", { name: /Дуб/ }))
    .toBeInTheDocument();
});

test("keeps a chain built through the pickers when the search is typed", async () => {
  const screen = await renderSupply(<TargetFields />);

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();
  await screen.getByLabelText("Материал").click();
  await screen.getByRole("option", { name: "Дуб" }).click();
  await screen.getByLabelText("Вариант").click();
  await screen.getByRole("option", { name: "Доска 40 мм" }).click();

  await screen.getByLabelText("Поиск").fill("Брусок");
  await userEvent.keyboard("{Escape}");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте вариант"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите единицу"))
    .not.toBeInTheDocument();
});

test("fills the type with a hidden type name from the search selection", async () => {
  const screen = await renderSupply(<TargetFields />, {
    routes: hiddenTypeRoutes,
  });

  await selectDoska(screen);
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте вариант"))
    .not.toBeInTheDocument();
});
