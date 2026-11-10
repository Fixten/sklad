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
