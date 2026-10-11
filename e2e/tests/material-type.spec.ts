import { expect, test } from "@playwright/test";

const backendPort = process.env.BACKEND_PORT ?? "1200";
const apiBase = `http://localhost:${backendPort}/api`;

test("creates a material type through the UI and persists it", async ({
  page,
  request,
}) => {
  const name = `e2e-${Date.now()}`;

  await page.goto("/material-type");
  const input = page.getByLabel("Добавить новый");
  await input.fill(name);
  await input.press("Enter");

  await expect
    .poll(async () => {
      const response = await request.get(`${apiBase}/material-type`);
      const rows = (await response.json()) as { name: string }[];
      return rows.some((row) => row.name === name);
    })
    .toBe(true);
});
