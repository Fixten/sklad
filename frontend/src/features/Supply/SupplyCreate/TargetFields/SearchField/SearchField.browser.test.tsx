import { expect, test } from "vitest";

import { renderSupply, selectDoska } from "../../testHarness";

import SearchField from ".";

test("searches variants inline and selects one", async () => {
  const screen = await renderSupply(<SearchField />);

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
  const screen = await renderSupply(<SearchField />);

  await selectDoska(screen);
  await screen.getByLabelText("Поиск").fill("Брусок");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Брусок 60 × 60/ }))
    .toBeInTheDocument();
});
