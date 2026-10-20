import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import CommandPalette from "./index";

const buildItems = () => [
  { key: "/", label: "Главная", onSelect: vi.fn() },
  { key: "/material", label: "Материалы", onSelect: vi.fn() },
  { key: "/settings", label: "Настройки", onSelect: vi.fn() },
];

const asInput = (element: HTMLElement | SVGElement) => {
  if (!(element instanceof HTMLInputElement)) {
    throw new Error("the locator does not point at an input");
  }

  return element;
};

test("renders only the one-line trigger by default", async () => {
  const items = buildItems();
  const screen = await render(<CommandPalette heading="Меню" items={items} />);

  await expect.element(screen.getByPlaceholder("Поиск")).toBeInTheDocument();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
  expect(document.querySelector("[cmdk-group-heading]")).toBeNull();

  for (const { label } of items) {
    await expect.element(screen.getByText(label)).not.toBeInTheDocument();
  }
});

test("keeps aria-expanded false at rest and true when open", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);
  const input = screen.getByPlaceholder("Поиск");

  await expect.element(input).toHaveAttribute("aria-expanded", "false");

  await input.click();

  await expect.element(input).toHaveAttribute("aria-expanded", "true");
});

test("opens on focus", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  asInput(screen.getByPlaceholder("Поиск").element()).focus();

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
  await expect.element(screen.getByText("Главная")).toBeInTheDocument();
});

test("opens on click", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  await screen.getByPlaceholder("Поиск").click();

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
});

test("opens on the global / shortcut and focuses the input", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);
  const input = asInput(screen.getByPlaceholder("Поиск").element());

  await userEvent.keyboard("/");

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
  expect(document.activeElement).toBe(input);
});

test("ignores the global / shortcut while typing in an input", async () => {
  const screen = await render(
    <div>
      <input aria-label="Поле" />
      <CommandPalette items={buildItems()} />
    </div>,
  );
  const field = screen.getByRole("textbox", { name: "Поле" });

  asInput(field.element()).focus();
  await userEvent.keyboard("/");

  await expect.element(field).toHaveValue("/");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("renders the panel as an absolute overlay without moving content", async () => {
  const screen = await render(
    <div>
      <CommandPalette items={buildItems()} />
      <div data-testid="below">Ниже</div>
    </div>,
  );

  const wrapper = screen.getByTestId("command-palette").element();
  const below = screen.getByTestId("below").element();
  const topBefore = below.getBoundingClientRect().top;

  await screen.getByPlaceholder("Поиск").click();

  const listbox = screen.getByRole("listbox").element();
  const wrapperRect = wrapper.getBoundingClientRect();
  const listboxRect = listbox.getBoundingClientRect();

  expect(getComputedStyle(listbox).position).toBe("absolute");
  expect(listboxRect.top).toBeCloseTo(wrapperRect.bottom, 1);
  expect(listboxRect.width).toBeCloseTo(wrapperRect.width, 1);
  expect(below.getBoundingClientRect().top).toBe(topBefore);
});

test("closes on Escape and clears the query", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);
  const input = screen.getByPlaceholder("Поиск");

  await input.click();
  await input.fill("материал");
  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();

  await input.click();
  await expect.element(input).toHaveValue("");
});

test("closes on an outside pointerdown", async () => {
  const screen = await render(
    <div>
      <button type="button">Снаружи</button>
      <CommandPalette items={buildItems()} />
    </div>,
  );

  await screen.getByPlaceholder("Поиск").click();
  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();

  await screen.getByText("Снаружи").click();

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("reopens when typing after Escape", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);
  const input = screen.getByPlaceholder("Поиск");

  await input.click();
  await userEvent.keyboard("{Escape}");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();

  await userEvent.keyboard("m");

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
  await expect.element(input).toHaveValue("m");
});

test("navigates items with the keyboard", async () => {
  const onSelectHome = vi.fn();
  const onSelectMaterials = vi.fn();
  const screen = await render(
    <CommandPalette
      items={[
        { key: "/", label: "Главная", onSelect: onSelectHome },
        { key: "/material", label: "Материалы", onSelect: onSelectMaterials },
      ]}
    />,
  );

  await screen.getByPlaceholder("Поиск").click();
  await userEvent.keyboard("{ArrowDown}{Enter}");

  expect(onSelectMaterials).toHaveBeenCalledOnce();
  expect(onSelectHome).not.toHaveBeenCalled();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("selects an item and closes", async () => {
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

  await screen.getByPlaceholder("Поиск").click();
  await screen.getByText("Настройки").click();

  expect(onSelectSettings).toHaveBeenCalledOnce();
  expect(onSelectHome).not.toHaveBeenCalled();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("filters items by the query when open", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  await screen.getByPlaceholder("Поиск").click();
  await screen.getByPlaceholder("Поиск").fill("материал");

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect.element(screen.getByText("Главная")).not.toBeInTheDocument();
});

test("shows the empty message when nothing matches", async () => {
  const screen = await render(
    <CommandPalette items={buildItems()} emptyMessage="Нету" />,
  );

  await screen.getByPlaceholder("Поиск").click();
  await screen.getByPlaceholder("Поиск").fill("zzz");

  await expect.element(screen.getByText("Нету")).toBeInTheDocument();
});

test("shows the empty message for an empty item list once opened", async () => {
  const screen = await render(
    <CommandPalette items={[]} emptyMessage="Пока нет действий" />,
  );

  await expect
    .element(screen.getByText("Пока нет действий"))
    .not.toBeInTheDocument();

  await screen.getByPlaceholder("Поиск").click();

  await expect
    .element(screen.getByText("Пока нет действий"))
    .toBeInTheDocument();
});

test("exposes an accessible tree when open", async () => {
  const screen = await render(
    <CommandPalette
      heading="Меню"
      items={[{ key: "/", label: "Главная", onSelect: vi.fn() }]}
    />,
  );

  await screen.getByPlaceholder("Поиск").click();

  await expect.element(screen.getByRole("listbox")).toMatchAriaInlineSnapshot(`
      - listbox "Меню":
        - group "Меню":
          - option "Главная" [selected]
    `);
});
