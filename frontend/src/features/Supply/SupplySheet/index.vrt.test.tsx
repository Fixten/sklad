import { expect, test } from "vitest";
import { page } from "vitest/browser";

import {
  emptyCatalog,
  fillDetails,
  openDetails,
  openSheet,
  renderSheet,
  stubApi,
} from "./testHarness";

const viewport = () => page.elementLocator(document.body);

test("renders the empty material step", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await expect.element(screen.getByText("01 / 02")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the matched variants with the creation row", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");

  await expect
    .element(screen.getByRole("listbox", { name: "Варианты" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Новый вариант в «Дуб»"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the new variant panel", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByText("Новый вариант в «Дуб»").click();

  await expect.element(screen.getByText("Новый вариант")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the new material panel over an existing type", async () => {
  stubApi();
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Ясень");
  await screen.getByText("Новый материал: «Ясень»").click();

  await expect.element(screen.getByText("Новый материал")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the new material panel with a new type", async () => {
  stubApi(emptyCatalog);
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");
  await screen.getByText("Новый материал: «Клён»").click();

  await expect
    .element(screen.getByLabelText("Название типа"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the reported errors of the new material panel", async () => {
  stubApi(emptyCatalog);
  const screen = await renderSheet();

  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Клён");
  await screen.getByText("Новый материал: «Клён»").click();
  await screen.getByText("Создать и продолжить").click();

  await expect
    .element(screen.getByText("Укажите название типа"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the second step of the sheet", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);

  await expect
    .element(screen.getByText("Дуб · Доска 40 мм"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the filled second step with the unit cost", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await fillDetails(screen);

  await expect.element(screen.getByText("3 000 ₽ / м")).toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the reported errors of the second step", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByText("Сохранить поставку").click();

  await expect
    .element(screen.getByText("Укажите количество"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});

test("renders the supplier list with the creation row", async () => {
  stubApi();
  const screen = await renderSheet();

  await openDetails(screen);
  await screen.getByLabelText("Поставщик").fill("Лес");

  await expect
    .element(screen.getByText("Новый поставщик: «Лес»"))
    .toBeInTheDocument();
  await expect(viewport()).toMatchScreenshot();
});
