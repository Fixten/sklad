import { expect, test } from "vitest";

import { renderSupply } from "../testHarness";

import DetailsFields from ".";

test("shows the unit cost", async () => {
  const screen = await renderSupply(<DetailsFields />, {
    defaults: { unit: "meters", quantity: "20", price: "12500" },
  });

  await expect.element(screen.getByText("Цена за единицу")).toBeInTheDocument();
  await expect.element(screen.getByText("625 ₽ / м")).toBeInTheDocument();
});

test("uses whole-piece quantity limits for pieces", async () => {
  const screen = await renderSupply(<DetailsFields />, {
    defaults: { unit: "pieces" },
  });

  const quantity = screen.getByLabelText("Количество");
  await expect.element(quantity).toHaveAttribute("min", "1");
  await expect.element(quantity).toHaveAttribute("step", "1");
});

test("commits a picked existing supplier", async () => {
  const screen = await renderSupply(<DetailsFields />);

  const supplier = screen.getByLabelText("Поставщик");
  await supplier.click();
  await supplier.fill("столяр");
  await screen.getByRole("option", { name: "Столярный двор" }).click();

  await expect.element(supplier).toHaveValue("Столярный двор");
});

test("commits a typed name as a new supplier", async () => {
  const screen = await renderSupply(<DetailsFields />);

  const supplier = screen.getByLabelText("Поставщик");
  await supplier.click();
  await supplier.fill("Новый поставщик");
  await screen.getByRole("option", { name: "Создать Новый поставщик" }).click();

  await expect.element(supplier).toHaveValue("Новый поставщик");
});
