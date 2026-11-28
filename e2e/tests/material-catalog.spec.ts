import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

const api = `http://127.0.0.1:${process.env.BACKEND_PORT ?? "1200"}/api`;
const suffix = Date.now().toString(36);
const typeName = `Wood ${suffix}`;
const materialName = `Oak ${suffix}`;
const otherMaterialName = `Bolt ${suffix}`;
const variantName = `Plank ${suffix}`;
const renamedVariant = `Plank ${suffix} revised`;
const newTypeName = `Plastic ${suffix}`;
const newMaterialName = `Cedar ${suffix}`;
const newVariantName = `Cedar plank ${suffix}`;

interface Row {
  id: number;
}

async function postRow(
  request: APIRequestContext,
  path: string,
  data: Record<string, unknown>,
): Promise<Row> {
  const response = await request.post(`${api}/${path}`, { data });
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<Row>;
}

async function seed(request: APIRequestContext) {
  const type = await postRow(request, "material-type", { name: typeName });
  const material = await postRow(request, "material", {
    name: materialName,
    material_type_id: type.id,
  });
  await postRow(request, "material", {
    name: otherMaterialName,
    material_type_id: type.id,
  });
  const variant = await postRow(request, "material-variant", {
    name: variantName,
    unit: "pieces",
    material_id: material.id,
  });
  const supply = await postRow(request, "supply", {
    quantity: 2,
    purchase_price: 100,
    material_variant_id: variant.id,
  });

  return { type, material, variant };
}

const searchField = (page: Page) =>
  page.locator('input[placeholder="Найти..."]');

async function selectLevel(page: Page, label: string) {
  await page.getByRole("combobox", { name: "Уровень" }).click();
  await page.getByRole("option", { name: label }).click();
}

async function pickOption(page: Page, label: string, option: string) {
  await page.getByLabel(label).click();
  await page.getByRole("option", { name: option }).click();
}

async function selectCommandAction(page: Page, label: string) {
  await page.getByPlaceholder("Начать работу").click();
  await page.getByRole("option", { name: label }).click();
}

test("material catalog full flow", async ({ page, request }) => {
  const { type, material, variant } = await seed(request);

  await page.goto("/materials");
  await expect(page.getByRole("heading", { name: "Материалы" })).toBeVisible();

  await searchField(page).fill(variantName);
  await expect(page.getByRole("link", { name: materialName })).toBeVisible();
  await expect(page.getByRole("link", { name: otherMaterialName })).toHaveCount(
    0,
  );

  await page.getByRole("link", { name: materialName }).click();
  await expect(page).toHaveURL(`/materials/material/${String(material.id)}`);
  await expect(
    page.getByRole("heading", { name: materialName, level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: variantName })).toBeVisible();

  await page.getByRole("link", { name: "← Материалы" }).click();
  await selectLevel(page, "Варианты");
  await searchField(page).fill(variantName);
  await page.getByRole("button", { name: "Сделать поставку" }).click();

  await expect(page).toHaveURL(
    `/materials/supply?variant=${String(variant.id)}`,
  );
  await expect(page.getByLabel("Тип")).toHaveValue(typeName);
  await expect(page.getByLabel("Материал")).toHaveValue(materialName);
  await expect(page.getByLabel("Вариант")).toHaveValue(variantName);
  await expect(page.getByRole("combobox", { name: /Единица/ })).toContainText(
    "штука",
  );

  await page.getByRole("link", { name: "← Материалы" }).click();
  await selectLevel(page, "Варианты");
  await searchField(page).fill(variantName);
  await page.getByRole("link", { name: variantName }).click();
  await expect(page).toHaveURL(`/materials/variant/${String(variant.id)}`);

  await page.getByRole("button", { name: "Редактировать" }).click();
  await expect(page.getByText("Единицу нельзя изменить")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Единица" })).toBeDisabled();
  await page.getByLabel("Название").fill(renamedVariant);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    page.getByRole("heading", { name: renamedVariant, level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("Единица: штука")).toBeVisible();

  await page.getByRole("link", { name: "← Материалы" }).click();
  await selectCommandAction(page, "Добавить тип");
  await page.getByLabel("Название").fill(newTypeName);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    page.getByRole("heading", { name: newTypeName, level: 1 }),
  ).toBeVisible();

  await page.getByRole("link", { name: "← Материалы" }).click();
  await selectCommandAction(page, "Добавить материал");
  await page.getByLabel("Название").fill(newMaterialName);
  await pickOption(page, "Тип", newTypeName);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    page.getByRole("heading", { name: newMaterialName, level: 1 }),
  ).toBeVisible();

  await page.getByRole("link", { name: "← Материалы" }).click();
  await selectCommandAction(page, "Добавить вариант");
  await page.getByLabel("Название").fill(newVariantName);
  await page.getByRole("combobox", { name: "Единица" }).click();
  await page.getByRole("option", { name: "штука" }).click();
  await pickOption(page, "Материал", newMaterialName);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    page.getByRole("heading", { name: newVariantName, level: 1 }),
  ).toBeVisible();

  await page
    .getByTestId("page-actions")
    .getByRole("button", { name: "Удалить" })
    .click();
  await expect(
    page.getByText("Если запись используется, она будет скрыта, а не удалена."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Да", exact: true }).click();
  await expect(page.getByText("Удалено").first()).toBeVisible();
  await expect(page).toHaveURL("/materials");

  await selectLevel(page, "Варианты");
  await searchField(page).fill(newVariantName);
  await expect(page.getByText("Каталог пуст")).toBeVisible();

  await selectLevel(page, "Типы");
  await searchField(page).fill(typeName);
  await page.getByRole("button", { name: "Удалить" }).click();
  await page.getByRole("button", { name: "Да", exact: true }).click();
  await expect(page.getByText("Удалено").last()).toBeVisible();
  await page.getByRole("button", { name: "Показать скрытые" }).click();
  await expect(page.getByText("Скрыто")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Восстановить" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Восстановить" }).click();
  await expect(page.getByText("Скрыто")).toHaveCount(0);
  await expect(page.getByRole("link", { name: typeName })).toBeVisible();

  const hidden = await request.delete(`${api}/material/${String(material.id)}`);
  expect(hidden.ok()).toBeTruthy();

  await searchField(page).fill("");
  await selectCommandAction(page, "Добавить материал");
  await page.getByLabel("Название").fill(materialName);
  await pickOption(page, "Тип", typeName);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(
    page.getByText("Скрыто, восстановите, чтобы продолжить."),
  ).toBeVisible();
  await expect(page.getByLabel("Название")).toHaveValue(materialName);
});
