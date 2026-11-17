import { Link } from "react-router";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { supplyPageRoutes } from "@/features/Supply/testFixtures";
import { errorResponse } from "@/test/apiStub.vitest";

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
  await userEvent.keyboard("{ArrowDown}{Enter}");

  await expect
    .element(screen.getByLabelText("Поиск"))
    .toHaveValue("Доска 40 мм");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();

  await userEvent.keyboard("{Enter}");

  await expect
    .element(screen.getByText("Укажите количество"))
    .toBeInTheDocument();
});

async function fillDoskaSupply(
  screen: Awaited<ReturnType<typeof renderSupply>>,
) {
  await selectDoska(screen);
  await screen.getByLabelText("Количество").fill("2");
  await screen.getByLabelText("Цена закупки, всего").fill("500");
}

test("saves the supply and returns to the materials page", async () => {
  const screen = await renderSupply(<SupplyCreate />, { form: false });

  await fillDoskaSupply(screen);
  await screen.getByRole("button", { name: "Сохранить" }).click();

  const request = screen.requests.find(
    (row) => row.method === "POST" && row.path === "/api/supply",
  );

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  expect(request?.body).toEqual({
    material_variant_id: 100,
    quantity: 2,
    purchase_price: 500,
  });
});

test("shows a pending label while the supply saves", async () => {
  const screen = await renderSupply(<SupplyCreate />, {
    form: false,
    routes: {
      ...supplyPageRoutes,
      "/api/supply": {
        get: () => [],
        post: () => new Promise<never>(() => undefined),
      },
    },
  });

  await fillDoskaSupply(screen);
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByRole("button", { name: "Сохраняем…" }))
    .toBeInTheDocument();
});

test("shows the api error inline and keeps the values on a failed save", async () => {
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

  await fillDoskaSupply(screen);
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Такой вариант уже существует"))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Количество")).toHaveValue(2);
  await expect
    .element(screen.getByRole("button", { name: "Сохранить" }))
    .toBeInTheDocument();
});

type Screen = Awaited<ReturnType<typeof renderSupply>>;

const commitExisting = async (screen: Screen, label: string, name: string) => {
  await screen.getByLabelText(label).click();
  await screen.getByRole("option", { name }).click();
};

test("saves an existing variant picked through the fields", async () => {
  const screen = await renderSupply(<SupplyCreate />, { form: false });

  await commitExisting(screen, "Тип", "Пиломатериал");
  await commitExisting(screen, "Материал", "Дуб");
  await commitExisting(screen, "Вариант", "Доска 40 мм");

  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toBeDisabled();
  await expect.element(screen.getByText("метр")).toBeInTheDocument();

  await screen.getByLabelText("Количество").fill("2");
  await screen.getByLabelText("Цена закупки, всего").fill("500");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  const request = screen.requests.find(
    (row) => row.method === "POST" && row.path === "/api/supply",
  );

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  expect(request?.body).toEqual({
    material_variant_id: 100,
    quantity: 2,
    purchase_price: 500,
  });
});

const withBackLink = (
  <>
    <Link to="/material">Материалы</Link>
    <SupplyCreate />
  </>
);

test("asks before leaving when the form is dirty", async () => {
  const screen = await renderSupply(withBackLink, { form: false });

  await screen.getByLabelText("Количество").fill("2");
  await screen.getByRole("link", { name: "Материалы" }).click();

  await expect.element(screen.getByRole("dialog")).toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Остаться" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "Уйти" }))
    .toBeInTheDocument();
});

test("leaves the dirty form on Уйти", async () => {
  const screen = await renderSupply(withBackLink, { form: false });

  await screen.getByLabelText("Количество").fill("2");
  await screen.getByRole("link", { name: "Материалы" }).click();
  await screen.getByRole("button", { name: "Уйти" }).click();

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("leaves without a dialog when the form is clean", async () => {
  const screen = await renderSupply(withBackLink, { form: false });

  await screen.getByRole("link", { name: "Материалы" }).click();

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("does not block navigation while the form is submitting", async () => {
  const screen = await renderSupply(withBackLink, {
    form: false,
    routes: {
      ...supplyPageRoutes,
      "/api/supply": {
        get: () => [],
        post: () => new Promise<never>(() => undefined),
      },
    },
  });

  await fillDoskaSupply(screen);
  await screen.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .element(screen.getByRole("button", { name: "Сохраняем…" }))
    .toBeInTheDocument();

  await screen.getByRole("link", { name: "Материалы" }).click();

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});
