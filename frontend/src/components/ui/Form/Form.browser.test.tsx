import { Controller } from "react-hook-form";
import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import zod from "zod";

import { Button } from "@ui/Button";
import { FormInputField, InputField } from "@ui/InputField";
import { FormSelectField } from "@ui/SelectField";

import { Form, useZodForm } from "./index";

const validator = zod.object({
  name: zod.string().trim().min(2, "Укажите хотя бы два символа"),
  unit: zod.string().min(1, "Выберите единицу"),
});

const options = [
  { value: "meters", label: "Метры" },
  { value: "pieces", label: "Штуки" },
];

type FormOutput = zod.output<typeof validator>;

interface TestFormProps {
  onSubmit: (value: FormOutput) => void;
}

function TestForm({ onSubmit }: TestFormProps) {
  const form = useZodForm({
    schema: validator,
    defaultValues: { name: "", unit: "" },
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInputField control={form.control} name="name" label="Имя" />
      <FormSelectField
        control={form.control}
        name="unit"
        label="Единица"
        options={options}
      />
      <Button type="submit">Сохранить</Button>
    </Form>
  );
}

test("blocks an invalid submit, renders field errors and focuses the first one", async () => {
  const onSubmit = vi.fn<(value: FormOutput) => void>();
  const screen = await render(<TestForm onSubmit={onSubmit} />);

  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Укажите хотя бы два символа"))
    .toBeVisible();
  await expect.element(screen.getByText("Выберите единицу")).toBeVisible();

  const input = screen.getByLabelText("Имя");
  await expect.element(input).toHaveAttribute("aria-invalid", "true");
  await expect.element(input).toHaveFocus();
  expect(
    input
      .element()
      .closest('[data-slot="field"]')
      ?.getAttribute("data-invalid"),
  ).toBe("true");

  const errorId = input.element().getAttribute("aria-describedby");
  expect(errorId).not.toBeNull();
  expect(document.getElementById(errorId ?? "")?.textContent).toContain(
    "Укажите хотя бы два символа",
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

const contactValidator = zod.object({
  contact: zod.string(),
});

function CompositeTestForm() {
  const form = useZodForm({
    schema: contactValidator,
    defaultValues: { contact: "" },
  });

  return (
    <Form form={form} onSubmit={vi.fn()}>
      <Controller
        control={form.control}
        name="contact"
        render={({ field, fieldState }) => (
          <>
            <InputField
              name={field.name}
              ref={field.ref}
              label="Контакт"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
            <span>{fieldState.isTouched ? "touched" : "untouched"}</span>
          </>
        )}
      />
    </Form>
  );
}

test("tracks a controlled value and touched state through Controller", async () => {
  const screen = await render(<CompositeTestForm />);
  const input = screen.getByLabelText("Контакт");

  await input.fill("Анна");
  await expect.element(input).toHaveValue("Анна");
  await expect.element(screen.getByText("untouched")).toBeVisible();

  input.element().blur();

  await expect.element(screen.getByText("touched")).toBeVisible();
});

const selectValidator = zod.object({
  unit: zod.string().min(1, "Выберите единицу"),
});

function SelectForm() {
  const form = useZodForm({
    schema: selectValidator,
    defaultValues: { unit: "" },
  });

  return (
    <Form form={form} onSubmit={vi.fn()}>
      <FormSelectField
        control={form.control}
        name="unit"
        label="Единица"
        options={options}
      />
      <Button type="submit">Сохранить</Button>
    </Form>
  );
}

test("focuses a select trigger when it is the first invalid field", async () => {
  const screen = await render(<SelectForm />);

  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect.element(screen.getByText("Выберите единицу")).toBeVisible();
  await expect
    .element(screen.getByRole("combobox", { name: "Единица" }))
    .toHaveFocus();
});

test("revalidates on change and submits trimmed schema output", async () => {
  const onSubmit = vi.fn<(value: FormOutput) => void>();
  const screen = await render(<TestForm onSubmit={onSubmit} />);

  await screen.getByRole("button", { name: "Сохранить" }).click();
  await screen.getByLabelText("Имя").fill("S");

  await expect
    .element(screen.getByText("Укажите хотя бы два символа"))
    .toBeVisible();

  await screen.getByLabelText("Имя").fill(" Skład ");
  await screen.getByRole("combobox", { name: "Единица" }).click();
  await screen.getByRole("option", { name: "Метры" }).click();

  await expect
    .element(screen.getByText("Укажите хотя бы два символа"))
    .not.toBeInTheDocument();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .poll(() => onSubmit.mock.calls[0]?.[0])
    .toEqual({ name: "Skład", unit: "meters" });
});
