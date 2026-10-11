import { expect, test } from "@playwright/test";

test("home page renders the app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Sklad");
  await expect(page.getByRole("banner")).toContainText("Sklad");
  await expect(
    page.getByRole("link", { name: "Типы материалов" }),
  ).toBeVisible();
});

test("navigates between pages", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Типы материалов" }).click();
  await expect(page).toHaveURL("/material-type");
  await expect(page.getByLabel("Добавить новый")).toBeVisible();

  await page.getByRole("link", { name: "Материалы" }).click();
  await expect(page).toHaveURL("/material");
  await expect(
    page.getByRole("button", { name: "Создать новый" }),
  ).toBeVisible();
});
