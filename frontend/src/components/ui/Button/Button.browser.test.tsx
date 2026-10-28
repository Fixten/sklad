import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Button } from ".";

test("defaults to a regular button", async () => {
  const onClick = vi.fn();
  const screen = await render(<Button onClick={onClick}>Сохранить</Button>);
  const button = screen.getByRole("button", { name: "Сохранить" });

  await expect.element(button).toHaveAttribute("type", "button");
  await button.click();

  expect(onClick).toHaveBeenCalledOnce();
});

test("keeps a pending submit enabled and swaps its label", async () => {
  const screen = await render(
    <Button type="submit" pending pendingLabel="Создаём…">
      Создать
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Создаём…" });

  await expect.element(button).toHaveAttribute("type", "submit");
  await expect.element(button).toHaveAttribute("aria-busy", "true");
  await expect.element(button).toBeEnabled();
});
