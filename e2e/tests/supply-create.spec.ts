import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

// The in-memory DB resets only when the e2e backend boots, and servers are reused
// between runs — each run seeds its own uniquely named catalog rows instead of cleaning up.
const api = `http://127.0.0.1:${process.env.BACKEND_PORT ?? "1200"}/api`;
const suffix = Date.now().toString(36);
const typeName = `Wood ${suffix}`;
const materialName = `Oak ${suffix}`;
const variantName = `Oak plank ${suffix}`;
const unitPicker = /Единица/;

interface CatalogVariant {
  id: number;
  name: string;
  unit: string;
}

async function seedVariant(
  request: APIRequestContext,
): Promise<CatalogVariant> {
  const type = await request.post(`${api}/material-type`, {
    data: { name: typeName },
  });
  expect(type.ok()).toBeTruthy();
  const typeId = (await type.json()).id as number;

  const material = await request.post(`${api}/material`, {
    data: { name: materialName, material_type_id: typeId },
  });
  expect(material.ok()).toBeTruthy();
  const materialId = (await material.json()).id as number;

  const variant = await request.post(`${api}/material-variant`, {
    data: { name: variantName, unit: "pieces", material_id: materialId },
  });
  expect(variant.ok()).toBeTruthy();

  return variant.json() as Promise<CatalogVariant>;
}

async function commit(page: Page, label: string, name: string) {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name }).click();
}

test("creates a supply through the UI and the stock reflects it", async ({
  page,
  request,
}) => {
  const variant = await seedVariant(request);

  await page.goto("/material");
  await page.getByPlaceholder("Начать работу").click();
  await page.getByText("Сделать поставку").click();

  await expect(page).toHaveURL("/material/supply");
  await expect(page.getByRole("heading", { name: "Поставка" })).toBeVisible();

  await commit(page, "Тип", typeName);
  await commit(page, "Материал", materialName);
  await commit(page, "Вариант", variantName);
  await expect(page.getByRole("combobox", { name: unitPicker })).toBeDisabled();

  await page.getByLabel("Количество").fill("2");
  await page.getByLabel("Цена закупки, всего").fill("500");
  await page.getByRole("button", { name: "Сохранить" }).click();

  await expect(page).toHaveURL("/material");
  await expect(page.getByText("Поставка создана")).toBeVisible();

  const stock = await request.get(`${api}/supply/stock/${String(variant.id)}`);
  expect(stock.ok()).toBeTruthy();
  expect(await stock.json()).toMatchObject({ quantity: 2, unit: "pieces" });
});

test("blocks saving when required fields are missing", async ({
  page,
  request,
}) => {
  await page.goto("/material/supply");

  const suppliesBefore = await (await request.get(`${api}/supply`)).json();

  await page.getByRole("button", { name: "Сохранить" }).click();

  await expect(page.getByText("Выберите или создайте вариант")).toBeVisible();
  await expect(page.getByText("Укажите количество")).toBeVisible();
  await expect(page.getByText("Укажите цену закупки")).toBeVisible();
  await expect(page).toHaveURL("/material/supply");

  const suppliesAfter = await (await request.get(`${api}/supply`)).json();
  expect(suppliesAfter).toEqual(suppliesBefore);
});
