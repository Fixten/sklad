import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { stubEmptySupplyPageApi, stubPageApi, renderPage } from "./testHarness";

const selectDoska = async (screen: Awaited<ReturnType<typeof renderPage>>) => {
  await screen.getByLabelText("Поиск").fill("Дуб");
  await screen.getByRole("option", { name: /Доска 40 мм/ }).click();
};

const selectReyka = async (screen: Awaited<ReturnType<typeof renderPage>>) => {
  await screen.getByLabelText("Поиск").fill("Рейка");
  await screen.getByRole("option", { name: /Рейка 20 × 40/ }).click();
};

test("renders the flat supply page without a dialog", async () => {
  stubPageApi();
  const screen = await renderPage();

  await expect
    .element(screen.getByRole("heading", { name: "Поставка" }))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Поиск")).toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("searches variants inline and selects one", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByLabelText("Поиск").fill("Дуб");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Доска 40 мм/ }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Брусок 60 × 60/ }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Рейка 20 × 40/ }))
    .toBeInTheDocument();

  await screen.getByRole("option", { name: /Доска 40 мм/ }).click();

  await expect
    .element(screen.getByLabelText("Поиск"))
    .toHaveValue("Доска 40 мм");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("starts a new search when the selected field is edited", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Поиск").fill("Брусок");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Брусок 60 × 60/ }))
    .toBeInTheDocument();
});

test("shows the unit cost for the selected variant", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Количество").fill("20");
  await screen.getByLabelText("Цена закупки, всего").fill("12500");

  await expect.element(screen.getByText("Цена за единицу")).toBeInTheDocument();
  await expect.element(screen.getByText("625 ₽ / м")).toBeInTheDocument();
});

test("fills the target pickers from the search selection", async () => {
  stubPageApi();
  const screen = await renderPage();

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
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Материал").click();

  await expect
    .element(screen.getByRole("option", { name: /Дуб/ }))
    .toBeInTheDocument();
});

test("keeps the query selection only while the query holds it", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Поиск").fill("");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect.element(screen.getByLabelText("Поиск")).toHaveValue("");
  await expect
    .element(screen.getByText("Выберите или создайте вариант"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Тип"))
    .toHaveValue("Пиломатериал");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Дуб");
});

test("starts a manual chain when a picker is edited after a selection", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Вариант").fill("Доска 50 мм");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect.element(screen.getByLabelText("Поиск")).toHaveValue("");
  await expect
    .element(screen.getByText("Выберите или создайте вариант"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Тип"))
    .toHaveValue("Пиломатериал");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Дуб");
});

test("keeps a chain built through the pickers when the search is typed", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();
  await screen.getByLabelText("Материал").click();
  await screen.getByRole("option", { name: "Дуб" }).click();
  await screen.getByLabelText("Вариант").click();
  await screen.getByRole("option", { name: "Доска 40 мм" }).click();

  await screen.getByLabelText("Поиск").fill("Брусок");
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

test("clears target errors when a search result is selected", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Сохранить" }).click();

  for (const message of [
    "Выберите или создайте тип",
    "Выберите или создайте материал",
    "Выберите или создайте вариант",
    "Выберите единицу",
  ]) {
    await expect.element(screen.getByText(message)).toBeInTheDocument();
  }

  await selectDoska(screen);

  for (const message of [
    "Выберите или создайте тип",
    "Выберите или создайте материал",
    "Выберите или создайте вариант",
    "Выберите единицу",
  ]) {
    await expect.element(screen.getByText(message)).not.toBeInTheDocument();
  }
});

test("uses whole-piece quantity limits for a pieces variant", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectReyka(screen);

  const quantity = screen.getByLabelText("Количество");
  await expect.element(quantity).toHaveAttribute("min", "1");
  await expect.element(quantity).toHaveAttribute("step", "1");
});

test("keeps the unit as the manual chain's unit after the selection is cleared", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Вариант").fill("Доска 50 мм");

  await expect.element(screen.getByText("метр")).toBeInTheDocument();
  await expect.element(screen.getByText("м")).toBeInTheDocument();
});

test("keeps the target pickers usable with an empty catalog", async () => {
  stubEmptySupplyPageApi();
  const screen = await renderPage();

  await screen.getByLabelText("Тип").fill("Ясень");
  await screen.getByLabelText("Материал").fill("Ясень 40");

  await expect.element(screen.getByLabelText("Тип")).toHaveValue("Ясень");
  await expect
    .element(screen.getByLabelText("Материал"))
    .toHaveValue("Ясень 40");
});

test("reports missing values on submit", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Сохранить" }).click();

  const variantError = screen.getByText("Выберите или создайте вариант");
  await expect.element(variantError).toBeInTheDocument();
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

test("submits the form on enter once the list is closed", async () => {
  stubPageApi();
  const screen = await renderPage();

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
