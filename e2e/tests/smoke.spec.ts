import { expect, test } from "@playwright/test";

test("home page renders the app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Sklad");
  await expect(page.getByRole("banner")).toContainText("Sklad");
  await expect(page.getByRole("link", { name: "Материалы" })).toBeVisible();
});

test("navigates between pages", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Материалы" }).click();
  await expect(page).toHaveURL("/material");

  await page.getByPlaceholder("Начать работу").fill("поставк");
  await page.getByText("Сделать поставку").click();
  await expect(page).toHaveURL("/material/supply");
});
