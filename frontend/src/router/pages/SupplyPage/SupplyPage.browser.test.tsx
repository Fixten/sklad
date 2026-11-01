import { expect, test } from "vitest";

import { renderPage, stubPageApi } from "./testHarness";

const selectDoska = async (screen: Awaited<ReturnType<typeof renderPage>>) => {
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByRole("option", { name: /Доска 40 мм/ }).click();
};

test("renders the flat supply page without a dialog", async () => {
  stubPageApi();
  const screen = await renderPage();

  await expect
    .element(screen.getByRole("heading", { name: "Поставка" }))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Материал")).toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("searches variants inline and selects one", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByLabelText("Материал").fill("Дуб");

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
    .element(screen.getByLabelText("Материал"))
    .toHaveValue("Доска 40 мм");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("starts a new search when the selected field is edited", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Материал").fill("Брусок");

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

test("reports missing values on submit", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByRole("button", { name: "Записать поставку" }).click();

  await expect
    .element(screen.getByText("Выберите материал"))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Материал")).toHaveFocus();
  await expect
    .element(screen.getByText("Укажите количество"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите цену закупки"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите поставщика"))
    .toBeInTheDocument();
});

test("accepts a valid draft and stops at the stage status", async () => {
  stubPageApi();
  const screen = await renderPage();

  await selectDoska(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await screen.getByLabelText("Поставщик").fill("Столярный двор");
  await screen.getByRole("button", { name: "Записать поставку" }).click();

  const status = screen.getByRole("status");
  await expect.element(status).toBeInTheDocument();
  expect(status.element().textContent).toContain("Форма проверена");
  expect(status.element().textContent).toContain("8 м");
  expect(status.element().textContent).toContain("Столярный двор");
});

test("shows an empty result when nothing matches", async () => {
  stubPageApi();
  const screen = await renderPage();

  await screen.getByLabelText("Материал").fill("Клён");

  await expect
    .element(screen.getByText("Ничего не нашлось"))
    .toBeInTheDocument();
});
