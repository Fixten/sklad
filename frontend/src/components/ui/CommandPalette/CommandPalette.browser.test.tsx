import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import CommandPalette from "./index";

const buildItems = () => [
  { key: "/", label: "Главная", onSelect: vi.fn() },
  { key: "/material", label: "Материалы", onSelect: vi.fn() },
  { key: "/settings", label: "Настройки", onSelect: vi.fn() },
];

test("renders the heading and every item", async () => {
  const items = buildItems();
  const screen = await render(<CommandPalette heading="Меню" items={items} />);

  await expect.element(screen.getByText("Меню")).toBeInTheDocument();

  for (const { label } of items) {
    await expect.element(screen.getByText(label)).toBeInTheDocument();
  }
});

test("invokes onSelect of the clicked item", async () => {
  const onSelectHome = vi.fn();
  const onSelectSettings = vi.fn();
  const screen = await render(
    <CommandPalette
      items={[
        { key: "/", label: "Главная", onSelect: onSelectHome },
        { key: "/settings", label: "Настройки", onSelect: onSelectSettings },
      ]}
    />,
  );

  await screen.getByText("Настройки").click();

  expect(onSelectSettings).toHaveBeenCalledOnce();
  expect(onSelectHome).not.toHaveBeenCalled();
});

test("filters items by the query", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  await screen.getByPlaceholder("Поиск").fill("материал");

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect.element(screen.getByText("Главная")).not.toBeInTheDocument();
});

test("shows the empty message when nothing matches", async () => {
  const screen = await render(
    <CommandPalette items={buildItems()} emptyMessage="Нету" />,
  );

  await screen.getByPlaceholder("Поиск").fill("zzz");

  await expect.element(screen.getByText("Нету")).toBeInTheDocument();
});

test("exposes an accessible tree", async () => {
  const screen = await render(
    <CommandPalette
      heading="Меню"
      items={[{ key: "/", label: "Главная", onSelect: vi.fn() }]}
    />,
  );

  await expect.element(screen.getByRole("listbox")).toMatchAriaInlineSnapshot(`
      - listbox "Suggestions":
        - group "Меню":
          - option "Главная" [selected]
    `);
});
