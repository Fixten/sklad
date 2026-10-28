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

test("applies the requested variant", async () => {
  const screen = await render(
    <>
      <Button>Сохранить</Button>
      <Button variant="ghost">Отмена</Button>
    </>,
  );

  const saveClass =
    screen
      .getByRole("button", { name: "Сохранить" })
      .element()
      .getAttribute("class") ?? "";
  const cancelClass =
    screen
      .getByRole("button", { name: "Отмена" })
      .element()
      .getAttribute("class") ?? "";

  expect(saveClass).toContain("bg-primary");
  expect(cancelClass).not.toContain("bg-primary");
  expect(cancelClass).toContain("hover:bg-muted");
});

test("supports the pending state on a regular button", async () => {
  const screen = await render(
    <Button pending pendingLabel="Загружаем…">
      Загрузить
    </Button>,
  );

  const button = screen.getByRole("button", { name: "Загружаем…" });

  await expect.element(button).toHaveAttribute("type", "button");
  await expect.element(button).toHaveAttribute("aria-busy", "true");
  await expect.element(button).toBeEnabled();
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
