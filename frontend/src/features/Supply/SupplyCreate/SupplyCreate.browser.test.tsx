import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { renderSupply, selectDoska } from "./testHarness";

import SupplyCreate from ".";

test("reports missing values on submit", async () => {
  const screen = await renderSupply(<SupplyCreate />, { form: false });

  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте вариант"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите количество"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите цену закупки"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите поставщика"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите единицу"))
    .toBeInTheDocument();
});

test("keeps the unit as the manual chain's unit after the selection is cleared", async () => {
  const screen = await renderSupply(<SupplyCreate />, { form: false });

  await selectDoska(screen);
  await screen.getByLabelText("Вариант").fill("Доска 50 мм");

  await expect.element(screen.getByText("метр")).toBeInTheDocument();
  await expect.element(screen.getByText("м")).toBeInTheDocument();
});

test("submits the form on enter once the list is closed", async () => {
  const screen = await renderSupply(<SupplyCreate />, { form: false });

  await screen.getByLabelText("Поиск").fill("Дуб");
  await userEvent.keyboard("{Enter}");

  await expect
    .element(screen.getByLabelText("Поиск"))
    .toHaveValue("Доска 40 мм");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();

  await userEvent.keyboard("{Enter}");

  await expect
    .element(screen.getByText("Укажите количество"))
    .toBeInTheDocument();
});
