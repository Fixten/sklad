import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import { supplyPageRoutes } from "@/features/Supply/testFixtures";
import type { Routes } from "@/test/apiStub";
import { errorResponse } from "@/test/apiStub.vitest";

import { renderSupply, selectDoska } from "./testHarness";

import SupplyCreate from ".";

const createdAt = "2026-01-01T00:00:00Z";

const createChainRoutes = {
  ...supplyPageRoutes,
  "/api/material-type": {
    get: supplyPageRoutes["/api/material-type"].get,
    post: ({ body }) => ({ id: 2, name: body.name, created_at: createdAt }),
  },
  "/api/material": {
    get: supplyPageRoutes["/api/material"].get,
    post: ({ body }) => ({
      id: 20,
      name: body.name,
      material_type_id: body.material_type_id,
      created_at: createdAt,
    }),
  },
  "/api/material-variant": {
    get: supplyPageRoutes["/api/material-variant"].get,
    post: ({ body }) => ({
      id: 300,
      name: body.name,
      unit: body.unit,
      material_id: body.material_id,
      created_at: createdAt,
    }),
  },
} satisfies Routes;

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

test("shows the api error inline when the supplier cannot be created", async () => {
  const screen = await renderSupply(<SupplyCreate />, {
    form: false,
    routes: {
      ...supplyPageRoutes,
      "/api/supplier": {
        get: () => supplyPageRoutes["/api/supplier"].get(),
        post: () => errorResponse(404, "Не удалось создать поставщика"),
      },
    },
  });

  await fillDoskaSupply(screen);
  const supplier = screen.getByLabelText("Поставщик");
  await supplier.click();
  await supplier.fill("Новый поставщик");
  await screen.getByRole("option", { name: "Создать Новый поставщик" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Не удалось создать поставщика"))
    .toBeInTheDocument();
  await expect.element(supplier).toHaveValue("Новый поставщик");
  await expect
    .element(screen.getByRole("button", { name: "Сохранить" }))
    .toBeInTheDocument();
});

type Screen = Awaited<ReturnType<typeof renderSupply>>;

const commitExisting = async (screen: Screen, label: string, name: string) => {
  await screen.getByLabelText(label).click();
  await screen.getByRole("option", { name }).click();
};

const commitNew = async (screen: Screen, label: string, name: string) => {
  const field = screen.getByLabelText(label);
  await field.click();
  await field.fill(name);
  await screen.getByRole("option", { name: `Создать ${name}` }).click();
};

const pickUnit = async (screen: Screen, name: string) => {
  await screen.getByRole("combobox", { name: /Единица/ }).click();
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

test("creates a new variant under an existing material on save", async () => {
  const screen = await renderSupply(<SupplyCreate />, {
    form: false,
    routes: createChainRoutes,
  });

  await commitExisting(screen, "Тип", "Пиломатериал");
  await commitExisting(screen, "Материал", "Дуб");
  await commitNew(screen, "Вариант", "Доска 50 мм");
  await pickUnit(screen, "метр");

  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toBeEnabled();

  await screen.getByLabelText("Количество").fill("2");
  await screen.getByLabelText("Цена закупки, всего").fill("500");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  const posts = screen.requests.filter((row) => row.method === "POST");

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  expect(posts.map((row) => row.path)).toEqual([
    "/api/material-variant",
    "/api/supply",
  ]);
  expect(posts[0]?.body).toEqual({
    name: "Доска 50 мм",
    unit: "meters",
    material_id: 10,
  });
  expect(posts[1]?.body).toEqual({
    material_variant_id: 300,
    quantity: 2,
    purchase_price: 500,
  });
});

test("creates the type, material, and variant chain on save", async () => {
  const screen = await renderSupply(<SupplyCreate />, {
    form: false,
    routes: createChainRoutes,
  });

  await commitNew(screen, "Тип", "Химия");
  await commitNew(screen, "Материал", "Краситель");
  await commitNew(screen, "Вариант", "Раствор 1 л");
  await pickUnit(screen, "штука");

  await screen.getByLabelText("Количество").fill("3");
  await screen.getByLabelText("Цена закупки, всего").fill("900");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect
    .poll(() =>
      screen.requests
        .filter((row) => row.method === "POST")
        .map((row) => row.path),
    )
    .toEqual([
      "/api/material-type",
      "/api/material",
      "/api/material-variant",
      "/api/supply",
    ]);
  const posts = screen.requests.filter((row) => row.method === "POST");
  expect(posts[0]?.body).toEqual({ name: "Химия" });
  expect(posts[1]?.body).toEqual({
    name: "Краситель",
    material_type_id: 2,
  });
  expect(posts[2]?.body).toEqual({
    name: "Раствор 1 л",
    unit: "pieces",
    material_id: 20,
  });
  expect(posts[3]?.body).toEqual({
    material_variant_id: 300,
    quantity: 3,
    purchase_price: 900,
  });
});
