import { useState } from "react";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import zod from "zod";

import { Form, useZodForm } from "@ui/Form";

import type { OptionPickerOption, OptionPickerProps } from "./OptionPicker";

import OptionPicker, { FormOptionPicker } from ".";

type StatefulPickerProps = Omit<OptionPickerProps, "value" | "onSelect"> & {
  value?: string;
  onSelect?: (value: string) => void;
};

function StatefulPicker(props: StatefulPickerProps) {
  const [value, setValue] = useState(props.value);

  return (
    <OptionPicker
      {...props}
      value={value}
      onSelect={(nextValue) => {
        setValue(nextValue);
        props.onSelect?.(nextValue);
      }}
    />
  );
}

const options: OptionPickerOption[] = [
  { value: "100", label: "Доска 40 мм" },
  { value: "101", label: "Брусок 60 × 60" },
  { value: "102", label: "Клей ПВА" },
];

test("selects an existing option", async () => {
  const onSelect = vi.fn<(value: string) => void>();
  const screen = await render(
    <OptionPicker
      label="Материал"
      value=""
      onSelect={onSelect}
      options={options}
    />,
  );

  await screen.getByRole("combobox").click();
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();

  await expect.poll(() => onSelect).toHaveBeenCalledWith("101");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("derives display from committed value", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value="101"
      onSelect={vi.fn()}
    />,
  );

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveValue("Брусок 60 × 60");
});

test("shows the error message", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value=""
      onSelect={vi.fn()}
      error="Обязательное поле"
    />,
  );

  await expect.element(screen.getByText("Обязательное поле")).toBeVisible();
});

test("shows the placeholder", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      placeholder="Название, тип или вариант"
      options={options}
      value=""
      onSelect={vi.fn()}
    />,
  );

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveAttribute("placeholder", "Название, тип или вариант");
});

test("updates display when the value changes", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value="100"
      onSelect={vi.fn()}
    />,
  );

  await expect.element(screen.getByRole("combobox")).toHaveValue("Доска 40 мм");

  await screen.rerender(
    <OptionPicker
      label="Материал"
      options={options}
      value="101"
      onSelect={vi.fn()}
    />,
  );

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveValue("Брусок 60 × 60");
});

test("shows empty input for unmatched value", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value="999"
      onSelect={vi.fn()}
    />,
  );

  await expect.element(screen.getByRole("combobox")).toHaveValue("");
});

test("shows a loader while loading", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      loading
      value=""
      onSelect={vi.fn()}
    />,
  );

  const spinner = screen.container.querySelector('[data-slot="spinner"]');

  expect(spinner).toBeVisible();
});

test("resets the value on typing", async () => {
  const onSelect = vi.fn<(value: string) => void>();
  const screen = await render(
    <OptionPicker
      label="Материал"
      value="101"
      onSelect={onSelect}
      options={options}
    />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.type(input, "Дуб");

  await expect.poll(() => onSelect).toHaveBeenCalledWith("");
});

test("selects another option after a commit", async () => {
  const onSelect = vi.fn<(value: string) => void>();
  const screen = await render(
    <StatefulPicker
      label="Материал"
      value=""
      onSelect={onSelect}
      options={options}
    />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();
  await expect.element(input).toHaveValue("Брусок 60 × 60");

  await userEvent.clear(input);
  await userEvent.fill(input, "Клей");
  await screen.getByRole("option", { name: "Клей ПВА" }).click();

  await expect.poll(() => onSelect).toHaveBeenLastCalledWith("102");
});

test("registers with react-hook-form", async () => {
  const onSubmit = vi.fn();
  const schema = zod.object({ material: zod.string().min(1) });

  function Harness() {
    const form = useZodForm({
      schema,
      defaultValues: { material: "" },
    });

    return (
      <Form form={form} onSubmit={onSubmit}>
        <FormOptionPicker
          control={form.control}
          name="material"
          label="Материал"
          options={options}
          onSelect={vi.fn()}
        />
        <button type="submit">Отправить</button>
      </Form>
    );
  }

  const screen = await render(<Harness />);

  await userEvent.click(screen.getByRole("combobox"));
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();
  await userEvent.click(screen.getByRole("button", { name: "Отправить" }));

  await expect
    .poll(() => onSubmit)
    .toHaveBeenCalledWith({ material: "101" }, expect.anything());
});

test("selects an option with the keyboard", async () => {
  const onSelect = vi.fn<(value: string) => void>();
  const screen = await render(
    <OptionPicker
      label="Материал"
      value=""
      onSelect={onSelect}
      options={options}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await userEvent.keyboard("{ArrowDown}{Enter}");

  await expect.poll(() => onSelect).toHaveBeenCalledTimes(1);
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("hides the create row for an empty query", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value=""
      onSelect={vi.fn()}
      canCreate
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));

  await expect
    .element(screen.getByRole("option", { name: /^Создать/ }))
    .not.toBeInTheDocument();
});

test("shows the label once options arrive", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={[]}
      value="101"
      onSelect={vi.fn()}
    />,
  );

  await expect.element(screen.getByRole("combobox")).toHaveValue("");

  await screen.rerender(
    <OptionPicker
      label="Материал"
      options={options}
      value="101"
      onSelect={vi.fn()}
    />,
  );

  await expect
    .element(screen.getByRole("combobox"))
    .toHaveValue("Брусок 60 × 60");
});

test("associates the label with the input", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value=""
      onSelect={vi.fn()}
    />,
  );

  const input = screen.getByRole("combobox").element();
  await screen.getByText("Материал").click();

  expect(document.activeElement).toBe(input);
});

test("creates a new option", async () => {
  const screen = await render(
    <StatefulPicker label="Материал" options={options} value="" canCreate />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "Дуб");

  await screen.getByRole("option", { name: "Создать Дуб" }).click();

  await expect.element(input).toHaveValue("Дуб");
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});

test("filters options by keywords", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      value=""
      onSelect={vi.fn()}
      options={[
        { value: "100", label: "Доска 40 мм", keywords: ["Пиломатериал"] },
        { value: "101", label: "Клей ПВА", keywords: ["Столярный"] },
      ]}
    />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "пилом");

  await expect
    .element(screen.getByRole("option", { name: "Доска 40 мм" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("option", { name: "Клей ПВА" }))
    .not.toBeInTheDocument();
});
test("shows the create option for a non-empty query", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      value=""
      onSelect={vi.fn()}
      canCreate
      options={options}
    />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "Дуб");

  await expect
    .element(screen.getByRole("option", { name: "Создать Дуб" }))
    .toBeVisible();
});
test("hides the create option for a whitespace-only query", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      value=""
      onSelect={vi.fn()}
      canCreate
      options={options}
    />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "   ");

  await expect
    .element(screen.getByRole("option", { name: /^Создать/ }))
    .not.toBeInTheDocument();
});
test("hides the create option while an existing option is selected", async () => {
  const screen = await render(
    <StatefulPicker label="Материал" options={options} value="" canCreate />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "Брус");
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();

  await userEvent.click(input);

  await expect
    .element(screen.getByRole("option", { name: /^Создать/ }))
    .not.toBeInTheDocument();
});
test("shows the create hint and plain input label after selecting a new option", async () => {
  const screen = await render(
    <StatefulPicker label="Материал" options={options} value="" canCreate />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "Дуб");
  await screen.getByRole("option", { name: "Создать Дуб" }).click();

  await expect.element(input).toHaveValue("Дуб");
  await expect
    .element(screen.getByText("Создать", { exact: true }))
    .toBeVisible();
});
test("hides the create hint after selecting an existing option", async () => {
  const screen = await render(
    <StatefulPicker label="Материал" options={options} value="" canCreate />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await userEvent.fill(input, "Брус");
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();

  await expect
    .element(screen.getByText("Создать", { exact: true }))
    .not.toBeInTheDocument();
});
test("does not clear the selected option when its label updates the input", async () => {
  const screen = await render(
    <StatefulPicker label="Материал" options={options} value="" />,
  );

  const input = screen.getByRole("combobox");
  await userEvent.click(input);
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();

  await expect.element(input).toHaveValue("Брусок 60 × 60");
});
test("submits the selected option value using the combobox name", async () => {
  const onSubmit = vi.fn<(formData: FormData) => void>();

  function Harness() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget));
        }}
      >
        <StatefulPicker
          label="Материал"
          options={options}
          value=""
          name="material"
        />
        <button type="submit">Отправить</button>
      </form>
    );
  }

  const screen = await render(<Harness />);

  await userEvent.click(screen.getByRole("combobox"));
  await screen.getByRole("option", { name: "Брусок 60 × 60" }).click();
  await userEvent.click(screen.getByRole("button", { name: "Отправить" }));

  await expect.poll(() => onSubmit).toHaveBeenCalled();

  const formData = onSubmit.mock.calls[0]?.[0];

  expect(formData?.get("material")).toBe("101");
});
test("closes the popup on Escape", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value=""
      onSelect={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await expect.element(screen.getByRole("listbox")).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});
test("closes the popup after clicking outside", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={options}
      value=""
      onSelect={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));
  await expect.element(screen.getByRole("listbox")).toBeVisible();

  await userEvent.click(document.body);

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
});
test("does not show the empty message while loading", async () => {
  const screen = await render(
    <OptionPicker
      label="Материал"
      options={[]}
      loading
      value=""
      onSelect={vi.fn()}
    />,
  );

  await userEvent.click(screen.getByRole("combobox"));

  await expect.element(screen.getByText("Ничего.")).not.toBeInTheDocument();
});
