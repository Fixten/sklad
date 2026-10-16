import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import Typography from "./Typography";

const tagName = (element: Element) => element.tagName.toLowerCase();

test("defaults to the body variant rendered as a paragraph", async () => {
  const screen = await render(<Typography>Склад</Typography>);

  const element = screen.getByText("Склад");
  await expect.element(element).toHaveRole("paragraph");
  await expect.element(element).toHaveClass("type-body");
});

test("maps variants to their default tag names", async () => {
  const screen = await render(
    <>
      <Typography variant="display">Раздел</Typography>
      <Typography variant="title">Карточка</Typography>
      <Typography variant="label">Подпись</Typography>
      <Typography variant="caption">Пояснение</Typography>
      <Typography variant="data">1 248,50</Typography>
    </>,
  );

  expect(tagName(screen.getByText("Раздел").element())).toBe("h1");
  expect(tagName(screen.getByText("Карточка").element())).toBe("h2");
  expect(tagName(screen.getByText("Подпись").element())).toBe("span");
  expect(tagName(screen.getByText("Пояснение").element())).toBe("p");
  expect(tagName(screen.getByText("1 248,50").element())).toBe("span");
  await expect.element(screen.getByText("Раздел")).toHaveRole("heading");
  await expect.element(screen.getByText("Карточка")).toHaveRole("heading");
});

test("tagName overrides the default tag", async () => {
  const screen = await render(
    <Typography variant="title" tagName="span">
      Sklad
    </Typography>,
  );

  const element = screen.getByText("Sklad");
  expect(tagName(element.element())).toBe("span");
  await expect.element(element).toHaveClass("type-title");
});

test("keeps the token class when className is appended", async () => {
  const screen = await render(
    <Typography variant="label" className="text-muted-foreground">
      Материал
    </Typography>,
  );

  const element = screen.getByText("Материал");
  await expect.element(element).toHaveClass("type-label");
  await expect.element(element).toHaveClass("text-muted-foreground");
});

test("data variant uses tabular figures", async () => {
  const screen = await render(<Typography variant="data">1248.50</Typography>);

  const element = screen.getByText("1248.50").element();
  expect(getComputedStyle(element).fontVariantNumeric).toContain(
    "tabular-nums",
  );
});

test("forwards rest props to the rendered element", async () => {
  const screen = await render(
    <Typography variant="label" tagName="a" href="/material">
      Материал
    </Typography>,
  );

  await expect
    .element(screen.getByRole("link", { name: "Материал" }))
    .toHaveAttribute("href", "/material");
});
