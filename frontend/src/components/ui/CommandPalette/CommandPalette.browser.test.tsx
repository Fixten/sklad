import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import CommandPalette from "./index";

const buildItems = () => [
  { value: "/", label: "Главная", onSelect: vi.fn() },
  { value: "/material", label: "Материалы", onSelect: vi.fn() },
  { value: "/settings", label: "Настройки", onSelect: vi.fn() },
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

  await expect
    .element(screen.getByPlaceholder("Начать работу"))
    .toBeInTheDocument();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
  expect(document.querySelector("[cmdk-group-heading]")).toBeNull();

  for (const { label } of items) {
    await expect.element(screen.getByText(label)).not.toBeInTheDocument();
  }
});

test("opens on focus", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  asInput(screen.getByPlaceholder("Начать работу").element()).focus();

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
  await expect.element(screen.getByText("Главная")).toBeInTheDocument();
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

  await screen.getByPlaceholder("Начать работу").click();

  const listbox = screen.getByRole("listbox").element();
  const wrapperRect = wrapper.getBoundingClientRect();
  const listboxRect = listbox.getBoundingClientRect();

  expect(getComputedStyle(listbox).position).toBe("absolute");
  expect(listboxRect.top).toBeCloseTo(wrapperRect.bottom, 1);
  expect(listboxRect.width).toBeCloseTo(wrapperRect.width, 1);
  expect(below.getBoundingClientRect().top).toBe(topBefore);
});

test("closes on Escape", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  await screen.getByPlaceholder("Начать работу").click();
  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("closes on an outside pointerdown", async () => {
  const screen = await render(
    <div>
      <button type="button">Снаружи</button>
      <CommandPalette items={buildItems()} />
    </div>,
  );

  await screen.getByPlaceholder("Начать работу").click();
  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();

  await screen.getByText("Снаружи").click();

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("opens on typing", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  await screen.getByPlaceholder("Начать работу").click();
  await userEvent.keyboard("{Escape}");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();

  await userEvent.keyboard("m");

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
});

test("navigates items with the keyboard", async () => {
  const onSelectHome = vi.fn();
  const onSelectMaterials = vi.fn();
  const screen = await render(
    <CommandPalette
      items={[
        { value: "/", label: "Главная", onSelect: onSelectHome },
        { value: "/material", label: "Материалы", onSelect: onSelectMaterials },
      ]}
    />,
  );

  await screen.getByPlaceholder("Начать работу").click();
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
        { value: "/", label: "Главная", onSelect: onSelectHome },
        { value: "/settings", label: "Настройки", onSelect: onSelectSettings },
      ]}
    />,
  );

  await screen.getByPlaceholder("Начать работу").click();
  await screen.getByText("Настройки").click();

  expect(onSelectSettings).toHaveBeenCalledOnce();
  expect(onSelectHome).not.toHaveBeenCalled();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("filters items by the query when open", async () => {
  const screen = await render(<CommandPalette items={buildItems()} />);

  await screen.getByPlaceholder("Начать работу").click();
  await screen.getByPlaceholder("Начать работу").fill("материал");

  await expect.element(screen.getByText("Материалы")).toBeInTheDocument();
  await expect.element(screen.getByText("Главная")).not.toBeInTheDocument();
});

test("shows the empty message when nothing matches", async () => {
  const screen = await render(
    <CommandPalette items={buildItems()} emptyMessage="Нету" />,
  );

  await screen.getByPlaceholder("Начать работу").click();
  await screen.getByPlaceholder("Начать работу").fill("zzz");

  await expect.element(screen.getByText("Нету")).toBeInTheDocument();
});
