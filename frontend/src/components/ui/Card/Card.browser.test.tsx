import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import Typography from "@ui/Typography";

import Card from "./index";

test("renders the title with an optional muted description", async () => {
  const screen = await render(
    <Card title="Доска сосна" description="Сорт первый" />,
  );

  await expect.element(screen.getByText("Доска сосна")).toBeInTheDocument();
  await expect.element(screen.getByText("Сорт первый")).toBeInTheDocument();
});

test("omits the description slot when it is absent", async () => {
  const screen = await render(<Card title="Древесина" />);

  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
  expect(screen.getByText("Сорт первый").query()).toBeNull();
});

test("renders children as trailing content", async () => {
  const screen = await render(
    <Card title="Доска сосна">
      <Typography variant="caption">Древесина</Typography>
    </Card>,
  );

  await expect.element(screen.getByText("Древесина")).toBeInTheDocument();
});
