import { expect, test } from "vitest";

import { stubPageApi, renderPage } from "./testHarness";

test("renders the flat supply page without a dialog", async () => {
  stubPageApi();
  const screen = await renderPage();

  await expect
    .element(screen.getByRole("heading", { name: "Поставка" }))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Поиск")).toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});
