import { expect, test } from "vitest";
import { page } from "vitest/browser";

import { supplyPageRoutes } from "@/features/Supply/testFixtures";
import { errorResponse } from "@/test/apiStub.vitest";

import { renderSupply, selectDoska } from "./testHarness";

import SupplyCreate from ".";

const viewport = () => page.elementLocator(document.body);

test("renders the filled form", async () => {
  const screen = await renderSupply(<SupplyCreate />, { form: false });

  await selectDoska(screen);
  await screen.getByLabelText("Количество").fill("2");
  await screen.getByLabelText("Цена закупки, всего").fill("500");

  await expect.element(screen.getByText("Цена за единицу")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the form with an inline error", async () => {
  const screen = await renderSupply(<SupplyCreate />, {
    form: false,
    routes: {
      ...supplyPageRoutes,
      "/api/supply": {
        get: () => [],
        post: () => errorResponse(409, "Такой вариант уже существует"),
      },
    },
  });

  await selectDoska(screen);
  await screen.getByLabelText("Количество").fill("2");
  await screen.getByLabelText("Цена закупки, всего").fill("500");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Такой вариант уже существует"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});
