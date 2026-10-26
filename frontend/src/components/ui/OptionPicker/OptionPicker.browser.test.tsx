import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import OptionPicker from "./index";

import type { OptionPickerItem, OptionPickerProps } from "./index";

const results: OptionPickerItem<number>[] = [
  { key: "100", value: 100, label: "Доска 40 мм" },
  { key: "101", value: 101, label: "Брусок 60 × 60" },
];

const createRowLabel = "Новый вариант в «Дуб»";

const baseProps = {
  id: "supply-material",
  label: "Материал",
  value: "Дуб",
  listLabel: "Варианты",
  results,
  onSelect: vi.fn(),
  onValueChange: vi.fn(),
} satisfies OptionPickerProps<number>;

test("stays a bare field while closed", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("listbox").query()).toBeNull();
});

test("wires the field to the list and its active option", async () => {
  const screen = await render(
    <OptionPicker
      {...baseProps}
      createLabel={createRowLabel}
      onCreate={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));

  const input = screen.getByRole("combobox").element();
  const activedescendant = input.getAttribute("aria-activedescendant");

  expect(input.getAttribute("aria-controls")).toBe("supply-material-list");
  expect(input.getAttribute("aria-expanded")).toBe("true");
  expect(input.getAttribute("aria-autocomplete")).toBe("list");
  expect(activedescendant).toBe("supply-material-list-option-1");
  expect(document.getElementById("supply-material-list")).not.toBeNull();
  expect(document.getElementById(activedescendant ?? "")).not.toBeNull();
  await expect
    .element(screen.getByRole("listbox"))
    .toHaveAttribute("aria-label", "Варианты");
  await expect
    .element(screen.getByRole("option", { name: "Доска 40 мм" }))
    .toHaveAttribute("aria-selected", "true");
});

test("places the create row first", async () => {
  const screen = await render(
    <OptionPicker
      {...baseProps}
      createLabel={createRowLabel}
      onCreate={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));

  expect(
    screen
      .getByRole("option")
      .elements()
      .map((element) => element.textContent),
  ).toEqual(["Новый вариант в «Дуб»", "Доска 40 мм", "Брусок 60 × 60"]);
});

test("shows only the create row when there are no results", async () => {
  const screen = await render(
    <OptionPicker
      {...baseProps}
      results={[]}
      createLabel="Новый материал: «Клён»"
      onCreate={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));

  expect(
    screen
      .getByRole("option")
      .elements()
      .map((element) => element.textContent),
  ).toEqual(["Новый материал: «Клён»"]);
});

test("moves the active option with the arrow keys and wraps", async () => {
  const screen = await render(
    <OptionPicker
      {...baseProps}
      createLabel={createRowLabel}
      onCreate={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await expect
    .element(screen.getByRole("option", { name: "Доска 40 мм" }))
    .toHaveAttribute("aria-selected", "true");

  await userEvent.keyboard("{ArrowDown}");
  await expect
    .element(screen.getByRole("option", { name: "Брусок 60 × 60" }))
    .toHaveAttribute("aria-selected", "true");

  await userEvent.keyboard("{ArrowDown}");
  await expect
    .element(screen.getByRole("option", { name: "Новый вариант в «Дуб»" }))
    .toHaveAttribute("aria-selected", "true");

  await userEvent.keyboard("{ArrowUp}");
  await expect
    .element(screen.getByRole("option", { name: "Брусок 60 × 60" }))
    .toHaveAttribute("aria-selected", "true");
});

test("falls back to the first result when the active result disappears", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{ArrowDown}");
  await expect
    .element(screen.getByRole("option", { name: "Брусок 60 × 60" }))
    .toHaveAttribute("aria-selected", "true");

  await screen.rerender(
    <OptionPicker {...baseProps} results={results.slice(0, 1)} />,
  );

  await expect
    .element(screen.getByRole("option", { name: "Доска 40 мм" }))
    .toHaveAttribute("aria-selected", "true");
});

test("resets the active option when the input value changes", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{ArrowDown}");
  await expect
    .element(screen.getByRole("option", { name: "Брусок 60 × 60" }))
    .toHaveAttribute("aria-selected", "true");

  await screen.rerender(<OptionPicker {...baseProps} value="Брусок" />);

  await expect
    .element(screen.getByRole("option", { name: "Доска 40 мм" }))
    .toHaveAttribute("aria-selected", "true");
});

test("keeps a result keyed create independent from the create row", async () => {
  const onCreate = vi.fn();
  const onSelect = vi.fn();
  const screen = await render(
    <OptionPicker
      {...baseProps}
      results={[{ key: "create", value: 100, label: "Доска 40 мм" }]}
      createLabel={createRowLabel}
      onCreate={onCreate}
      onSelect={onSelect}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await screen.getByRole("option", { name: "Доска 40 мм" }).click();

  expect(onSelect).toHaveBeenCalledWith(100);
  expect(onCreate).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole("combobox"));
  await screen.getByRole("option", { name: createRowLabel }).click();

  expect(onCreate).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledTimes(1);
});

test("selects the active option on enter", async () => {
  const onSelect = vi.fn();
  const screen = await render(
    <OptionPicker
      {...baseProps}
      createLabel={createRowLabel}
      onCreate={vi.fn()}
      onSelect={onSelect}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{Enter}");

  expect(onSelect).toHaveBeenCalledWith(100);
});

test("routes the create row to onCreate only", async () => {
  const onSelect = vi.fn();
  const onCreate = vi.fn();
  const screen = await render(
    <OptionPicker
      {...baseProps}
      createLabel={createRowLabel}
      onCreate={onCreate}
      onSelect={onSelect}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await screen.getByRole("option", { name: "Новый вариант в «Дуб»" }).click();

  expect(onCreate).toHaveBeenCalledTimes(1);
  expect(onSelect).not.toHaveBeenCalled();
  expect(screen.getByRole("listbox").query()).toBeNull();
});

test("closes the list on escape and keeps focus", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{Escape}");

  expect(screen.getByRole("listbox").query()).toBeNull();
  await expect
    .element(screen.getByRole("combobox"))
    .toHaveAttribute("aria-expanded", "false");
  expect(document.activeElement).toBe(screen.getByRole("combobox").element());
});

test("leaves escape to the sheet once the list is closed", async () => {
  const outer = vi.fn();
  const screen = await render(
    <div
      onKeyDown={(event) => {
        outer(event.defaultPrevented);
      }}
    >
      <OptionPicker {...baseProps} />
    </div>,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{Escape}{Escape}");

  expect(outer).toHaveBeenLastCalledWith(false);
});

test("reopens on the next keystroke after escape", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{Escape}");
  expect(screen.getByRole("listbox").query()).toBeNull();

  await userEvent.keyboard("Д");

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveAttribute("aria-expanded", "true");
});

test("reopens on a click after escape", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{Escape}");
  expect(screen.getByRole("listbox").query()).toBeNull();

  await userEvent.click(screen.getByRole("combobox"));

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveAttribute("aria-expanded", "true");
});

test("keeps the list in the flow", async () => {
  const screen = await render(<OptionPicker {...baseProps} />);

  await userEvent.click(screen.getByRole("combobox"));

  expect(getComputedStyle(screen.getByRole("listbox").element()).position).toBe(
    "static",
  );
});

test("closes on an outside click", async () => {
  const screen = await render(
    <>
      <OptionPicker {...baseProps} />
      <button type="button">Снаружи</button>
    </>,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.click(screen.getByRole("button", { name: "Снаружи" }));

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("closes when tabbing away", async () => {
  const screen = await render(
    <>
      <OptionPicker {...baseProps} />
      <button type="button">Снаружи</button>
    </>,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{Tab}");

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("closes after selecting an option", async () => {
  const onSelect = vi.fn();
  const screen = await render(
    <OptionPicker {...baseProps} onSelect={onSelect} />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await screen.getByRole("option", { name: "Доска 40 мм" }).click();

  expect(onSelect).toHaveBeenCalledWith(100);
  expect(screen.getByRole("listbox").query()).toBeNull();
});

test("passes the field contract through", async () => {
  const screen = await render(
    <OptionPicker
      {...baseProps}
      placeholder="Название, тип или вариант"
      hint="Поиск по названию, типу и варианту."
    />,
  );

  const input = screen.getByRole("combobox").element() as HTMLInputElement;

  expect(input.id).toBe("supply-material");
  expect(input.value).toBe("Дуб");
  expect(input.placeholder).toBe("Название, тип или вариант");
  expect(document.getElementById("supply-material-hint")?.textContent).toBe(
    "Поиск по названию, типу и варианту.",
  );
  expect(document.querySelector('label[for="supply-material"]')).not.toBeNull();
});
