import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";

import {
  emptyCatalog,
  fillDetails,
  fullCatalog,
  openDetails,
  openSheet,
  renderSheet,
  selectSupplier,
  stubApi,
} from "./testHarness";

const variantOption = (name: string) => ({ name: new RegExp(name) });

test("shows the keyboard hint throughout the pick step", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);

  await expect.element(screen.getByText("↑↓ Выбрать · Enter")).toBeVisible();
});

test("lists every variant of the matched material", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", variantOption("Доска 40 мм")))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", variantOption("Брусок 60 × 60")))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", variantOption("Рейка 20 × 40")))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", variantOption("Заготовка")))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Новый вариант в «Дуб»"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Материал"))
    .toHaveAttribute("aria-activedescendant", "supply-material-list-option-1");
});

test("matches variants by material type", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("рейка");

  await expect
    .element(screen.getByRole("option", variantOption("Рейка 20 × 40")))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", variantOption("Доска 40 мм")))
    .not.toBeInTheDocument();
});

test("moves the active option with the arrow keys and selects it on enter", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");

  const first = screen.getByRole("option", variantOption("Доска 40 мм"));
  const second = screen.getByRole("option", variantOption("Брусок 60 × 60"));

  await expect.element(first).toHaveAttribute("aria-selected", "true");

  await userEvent.keyboard("{ArrowDown}");

  await expect.element(first).toHaveAttribute("aria-selected", "false");
  await expect.element(second).toHaveAttribute("aria-selected", "true");

  await userEvent.keyboard("{Enter}");

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
  await expect.element(first).not.toBeInTheDocument();
});

test("wraps upward onto the creation row", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");

  await userEvent.keyboard("{ArrowUp}");

  await expect
    .element(screen.getByRole("option", variantOption("Новый вариант в «Дуб»")))
    .toHaveAttribute("aria-selected", "true");

  await userEvent.keyboard("{Enter}");

  await expect.element(screen.getByText("Новый вариант")).toBeInTheDocument();
});

test("offers a new material when nothing matches", async () => {
  stubApi(emptyCatalog);
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");

  await expect
    .element(screen.getByText("↑↓ Выбрать · Enter"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Новый материал: «Клён»"))
    .toBeInTheDocument();
});

test("creates a variant for the matched material", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByText("Новый вариант в «Дуб»").click();

  await expect.element(screen.getByText("Новый вариант")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Пиломатериал · Дуб"))
    .toBeInTheDocument();

  await screen.getByLabelText("Вариант").fill("Брусок 80 × 80");
  await userEvent.keyboard("{Enter}");

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
  expect(
    requests.filter((request) => request.method === "POST").at(-1),
  ).toEqual({
    path: "/api/material-variant",
    method: "POST",
    search: "",
    body: { name: "Брусок 80 × 80", unit: "meters", material_id: 10 },
  });
});

test("reports a missing variant name before saving", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByText("Новый вариант в «Дуб»").click();
  await screen.getByText("Создать и продолжить").click();

  await expect
    .element(screen.getByText("Укажите название варианта"))
    .toBeInTheDocument();
  expect(requests.some((request) => request.method === "POST")).toBe(false);

  await screen.getByLabelText("Вариант").fill("Брусок 80 × 80");
  await screen.getByText("Создать и продолжить").click();

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите название варианта"))
    .not.toBeInTheDocument();
});

test("creates a type, a material and a variant in one pass", async () => {
  const requests = stubApi(emptyCatalog);
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");
  await screen.getByText("Новый материал: «Клён»").click();

  await expect.element(screen.getByText("Новый материал")).toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Название типа"))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Клён");

  await screen.getByLabelText("Название типа").fill("Древесина");
  await screen.getByLabelText("Вариант").fill("Доска 40 мм");
  await screen.getByText("Создать и продолжить").click();

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toEqual([
    {
      path: "/api/material-type",
      method: "POST",
      search: "",
      body: { name: "Древесина" },
    },
    {
      path: "/api/material",
      method: "POST",
      search: "",
      body: { name: "Клён", material_type_id: 7 },
    },
    {
      path: "/api/material-variant",
      method: "POST",
      search: "",
      body: { name: "Доска 40 мм", unit: "meters", material_id: 20 },
    },
  ]);
});

test("keeps the material action enabled and shows progress while saving", async () => {
  let resolveMaterial!: (response: Response) => void;
  const materialResponse = new Promise<Response>((resolve) => {
    resolveMaterial = resolve;
  });
  const requests = stubApi(fullCatalog, { materialResponse });
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Ясень");
  await screen.getByText("Новый материал: «Ясень»").click();
  await screen.getByLabelText("Вариант").fill("Доска 30 мм");
  await screen.getByRole("button", { name: "Создать и продолжить" }).click();

  const busyButton = screen.getByRole("button", { name: /Создаём/ });
  await expect.element(busyButton).toBeVisible();
  await expect.element(busyButton).toBeEnabled();
  await busyButton.click();

  expect(
    requests.filter(
      (request) =>
        request.method === "POST" && request.path === "/api/material",
    ),
  ).toHaveLength(1);

  resolveMaterial(
    new Response(
      JSON.stringify({
        id: 20,
        name: "Ясень",
        material_type_id: 1,
        created_at: "2026-01-01T00:00:00Z",
      }),
      { headers: { "Content-Type": "application/json" } },
    ),
  );

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
});

test("uses an existing type without creating another one", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Ясень");
  await screen.getByText("Новый материал: «Ясень»").click();

  await expect
    .element(screen.getByLabelText("Название типа"))
    .not.toBeInTheDocument();
  const typeField = screen.getByRole("combobox", { name: "Тип" });
  await expect.element(typeField).toBeInTheDocument();
  expect(typeField.element().textContent).toContain("Пиломатериал");

  await screen.getByLabelText("Вариант").fill("Доска 30 мм");
  await screen.getByText("Создать и продолжить").click();

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toEqual([
    {
      path: "/api/material",
      method: "POST",
      search: "",
      body: { name: "Ясень", material_type_id: 1 },
    },
    {
      path: "/api/material-variant",
      method: "POST",
      search: "",
      body: { name: "Доска 30 мм", unit: "meters", material_id: 20 },
    },
  ]);
});

test("uses the first existing type when types load after the material step opens", async () => {
  let resolveTypes!: (response: Response) => void;
  const typesResponse = new Promise<Response>((resolve) => {
    resolveTypes = resolve;
  });
  stubApi(emptyCatalog, { typesResponse });
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");
  await screen.getByText("Новый материал: «Клён»").click();
  await expect
    .element(screen.getByLabelText("Название типа"))
    .toBeInTheDocument();

  resolveTypes(
    new Response(
      JSON.stringify([
        { id: 1, name: "Пиломатериал", created_at: "2026-01-01T00:00:00Z" },
      ]),
      { headers: { "Content-Type": "application/json" } },
    ),
  );

  const typeField = screen.getByRole("combobox", { name: "Тип" });
  await expect
    .element(screen.getByLabelText("Название типа"))
    .not.toBeInTheDocument();
  expect(typeField.element().textContent).toContain("Пиломатериал");
});

test("keeps a newly entered type selected while types load", async () => {
  let resolveTypes!: (response: Response) => void;
  const typesResponse = new Promise<Response>((resolve) => {
    resolveTypes = resolve;
  });
  stubApi(emptyCatalog, { typesResponse });
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");
  await screen.getByText("Новый материал: «Клён»").click();
  await screen.getByLabelText("Название типа").fill("Древесина");

  resolveTypes(
    new Response(
      JSON.stringify([
        { id: 1, name: "Пиломатериал", created_at: "2026-01-01T00:00:00Z" },
      ]),
      { headers: { "Content-Type": "application/json" } },
    ),
  );

  await expect
    .element(screen.getByLabelText("Название типа"))
    .toHaveValue("Древесина");
});

test("reports every missing name in the material panel", async () => {
  stubApi(emptyCatalog);
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");
  await screen.getByText("Новый материал: «Клён»").click();
  await screen.getByText("Создать и продолжить").click();

  await expect
    .element(screen.getByText("Укажите название типа"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите название варианта"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите название материала"))
    .not.toBeInTheDocument();

  await screen.getByLabelText("Название типа").fill("Древесина");
  await screen.getByLabelText("Вариант").fill("Доска 40 мм");
  await expect
    .element(screen.getByText("Укажите название типа"))
    .not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите название варианта"))
    .not.toBeInTheDocument();
});

test("keeps the query when going back from a panel", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByText("Новый вариант в «Дуб»").click();
  await screen.getByText("Назад").click();

  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Дуб");
  await expect
    .element(screen.getByRole("option", variantOption("Доска 40 мм")))
    .toBeInTheDocument();
});

test("closes the sheet and forgets everything on cancel", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByText("Отмена").click();

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();

  await openSheet(screen);

  await expect.element(screen.getByLabelText("Материал")).toHaveValue("");
  await expect.element(screen.getByRole("option")).not.toBeInTheDocument();
});

test("closes the sheet on escape", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("closes the open list before the sheet on escape", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .toBeInTheDocument();

  await userEvent.keyboard("{Escape}");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .not.toBeInTheDocument();
  await expect.element(screen.getByRole("dialog")).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
});

test("opens the second step with the chosen variant", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);

  await expect
    .element(screen.getByText("Дуб · Доска 40 мм"))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Количество")).toBeInTheDocument();
  await expect.element(screen.getByText("В метрах")).toBeInTheDocument();
  await expect.element(screen.getByText("₽ за партию")).toBeInTheDocument();
  await expect
    .element(screen.getByLabelText("Поставщик"))
    .toHaveAttribute("placeholder", "Например, Столярный двор");
  await expect.element(screen.getByLabelText("Описание")).toBeInTheDocument();
  await expect.element(screen.getByLabelText("Ссылка")).toBeInTheDocument();
  await expect.element(screen.getByText("—")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Появится после ввода количества и цены."))
    .toBeInTheDocument();
});

test("closes the supplier list on an outside click", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Поставщик").fill("Лес");

  await expect
    .element(screen.getByRole("listbox", { name: "Поставщики" }))
    .toBeInTheDocument();

  await screen.getByLabelText("Описание").click();

  await expect
    .element(screen.getByRole("listbox", { name: "Поставщики" }))
    .not.toBeInTheDocument();
});

test("derives the unit cost from the lot price", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");

  await expect.element(screen.getByText("3 000 ₽ / м")).toBeInTheDocument();
  await expect.element(screen.getByText("24 000 ₽ ÷ 8 м")).toBeInTheDocument();
});

test("reports the missing quantity and supplier", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await screen.getByText("Сохранить поставку").click();

  await expect
    .element(screen.getByText("Укажите количество"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите поставщика"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Укажите цену закупки"))
    .not.toBeInTheDocument();
  expect(
    requests.some(
      (request) =>
        request.method === "POST" && request.path.endsWith("/supply"),
    ),
  ).toBe(false);
});

test("saves the supply with an existing supplier", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await fillDetails(screen);
  await screen.getByLabelText("Описание").fill("Осенняя партия");
  await screen.getByText("Сохранить поставку").click();

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  expect(
    requests.filter(
      (request) =>
        request.method === "POST" && request.path.endsWith("/supply"),
    ),
  ).toEqual([
    {
      path: "/api/supply",
      method: "POST",
      search: "",
      body: {
        material_variant_id: 100,
        quantity: 8,
        purchase_price: 24000,
        supplier_id: 5,
        description: "Осенняя партия",
      },
    },
  ]);
});

test("accepts a free lot with a zero price", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("0");
  await screen.getByLabelText("Поставщик").fill("Столярный двор");
  await screen.getByRole("option", { name: /Столярный двор/ }).click();
  await screen.getByText("Сохранить поставку").click();

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  expect(
    requests.find(
      (request) =>
        request.method === "POST" && request.path.endsWith("/supply"),
    )?.body,
  ).toMatchObject({ purchase_price: 0, quantity: 8 });
});

test("selects the matched supplier when the creation row is present", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await screen.getByLabelText("Поставщик").fill("Лес");

  await expect
    .element(screen.getByText("Новый поставщик: «Лес»"))
    .toBeInTheDocument();
  await screen.getByRole("option", { name: /Лесоторг/ }).click();

  await expect
    .element(screen.getByLabelText("Поставщик"))
    .toHaveValue("Лесоторг");
  await screen.getByText("Сохранить поставку").click();

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toEqual([
    {
      path: "/api/supply",
      method: "POST",
      search: "",
      body: {
        material_variant_id: 100,
        quantity: 8,
        purchase_price: 24000,
        supplier_id: 6,
      },
    },
  ]);
});

test("creates the supplier from the creation row when another matches", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await screen.getByLabelText("Поставщик").fill("Лес");

  await screen.getByText("Новый поставщик: «Лес»").click();

  await expect.element(screen.getByLabelText("Поставщик")).toHaveValue("Лес");
  await screen.getByText("Сохранить поставку").click();

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toEqual([
    {
      path: "/api/supplier",
      method: "POST",
      search: "",
      body: { name: "Лес" },
    },
    {
      path: "/api/supply",
      method: "POST",
      search: "",
      body: {
        material_variant_id: 100,
        quantity: 8,
        purchase_price: 24000,
        supplier_id: 9,
      },
    },
  ]);
});

test("creates the supplier when the name is new", async () => {
  const requests = stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await screen.getByLabelText("Поставщик").fill("Новый склад");

  await expect
    .element(screen.getByText("Новый поставщик: «Новый склад»"))
    .toBeInTheDocument();
  await screen.getByText("Новый поставщик: «Новый склад»").click();
  await screen.getByText("Сохранить поставку").click();

  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
  expect(requests.filter((request) => request.method === "POST")).toEqual([
    {
      path: "/api/supplier",
      method: "POST",
      search: "",
      body: { name: "Новый склад" },
    },
    {
      path: "/api/supply",
      method: "POST",
      search: "",
      body: {
        material_variant_id: 100,
        quantity: 8,
        purchase_price: 24000,
        supplier_id: 9,
      },
    },
  ]);
});

test("reports a rejected supply without losing the values", async () => {
  stubApi(fullCatalog, {
    supplyFailure: { status: 400, message: "Недостаточно прав" },
  });
  const screen = await renderSheet();

  await openDetails(screen);
  await fillDetails(screen);
  await screen.getByText("Сохранить поставку").click();

  await expect
    .element(screen.getByText("Недостаточно прав"))
    .toBeInTheDocument();
  await expect.element(screen.getByText("↑↓ Выбрать · Enter")).toBeVisible();
  await expect.element(screen.getByRole("dialog")).toBeInTheDocument();
  expect(
    (screen.getByLabelText("Количество").element() as HTMLInputElement).value,
  ).toBe("8");
  await expect
    .element(screen.getByLabelText("Поставщик"))
    .toHaveValue("Столярный двор");
});

test("returns to the pick step from the details", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByText("Назад").click();

  await expect.element(screen.getByText("01 / 02")).toBeInTheDocument();
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Дуб");
});

test("forgets the details form after creating a variant", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await selectSupplier(screen, "Столярный двор");

  await screen.getByText("Назад").click();
  await screen.getByText("Новый вариант в «Дуб»").click();
  await screen.getByLabelText("Вариант").fill("Брусок 80 × 80");
  await screen.getByText("Создать и продолжить").click();

  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
  expect(
    (screen.getByLabelText("Количество").element() as HTMLInputElement).value,
  ).toBe("");
  expect(
    (screen.getByLabelText("Цена закупки, всего").element() as HTMLInputElement)
      .value,
  ).toBe("");
  await expect.element(screen.getByLabelText("Поставщик")).toHaveValue("");
});
