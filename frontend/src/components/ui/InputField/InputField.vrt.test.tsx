import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { InputField, FieldGroup } from "./index";

import type { ReactElement } from "react";

function Shell({ children }: { children: ReactElement }) {
  return (
    <div data-testid="field" className="bg-background flex w-80 flex-col p-6">
      {children}
    </div>
  );
}

const mount = async (element: ReactElement) => {
  const screen = await render(<Shell>{element}</Shell>);
  const field = screen.getByTestId("field");
  await expect.element(field).toBeInTheDocument();

  return field;
};

const states: { name: string; element: () => ReactElement }[] = [
  {
    name: "empty",
    element: () => <InputField label="Материал" placeholder="Например: Дуб" />,
  },
  {
    name: "filled",
    element: () => <InputField label="Материал" defaultValue="Дуб" />,
  },
  {
    name: "hint",
    element: () => (
      <InputField label="Материал" hint="Например: Дуб, ясень, берёза" />
    ),
  },
  {
    name: "unit",
    element: () => (
      <InputField label="Количество" unit="кг" placeholder="0,00" />
    ),
  },
  {
    name: "number",
    element: () => (
      <InputField
        label="Количество"
        unit="кг"
        type="number"
        min={0}
        step={0.01}
        defaultValue="12.5"
      />
    ),
  },
  {
    name: "invalid",
    element: () => (
      <InputField
        label="Количество"
        unit="кг"
        defaultValue="0"
        error="Укажите количество — от 0,01"
      />
    ),
  },
  {
    name: "invalid-with-hint",
    element: () => (
      <InputField
        label="Материал"
        hint="Например: Дуб, ясень, берёза"
        error="Укажите материал или создайте новый"
      />
    ),
  },
  {
    name: "disabled",
    element: () => <InputField label="Материал" defaultValue="Дуб" disabled />,
  },
  {
    name: "read-only",
    element: () => (
      <InputField label="Единица измерения" defaultValue="Метры" readOnly />
    ),
  },
  {
    name: "long-label",
    element: () => (
      <InputField
        label="Себестоимость за единицу измерения"
        defaultValue="1248.50"
      />
    ),
  },
];

test.each(states)("renders the $name field", async ({ element }) => {
  const field = await mount(element());

  await expect.element(field).toMatchScreenshot();
});

test("renders the focused number field", async () => {
  const field = await mount(
    <InputField
      label="Цена закупки"
      unit="₽"
      type="number"
      min={0}
      step={0.01}
      defaultValue="1248.5"
    />,
  );

  const input = document.querySelector<HTMLInputElement>(
    'input[type="number"]',
  );
  if (!input) throw new Error("the focused case has no number input");
  input.focus();

  await expect.element(field).toMatchScreenshot();
});

test("stacks a field group", async () => {
  const field = await mount(
    <FieldGroup>
      <InputField label="Материал" defaultValue="Дуб" />
      <InputField
        label="Количество"
        unit="кг"
        type="number"
        defaultValue="12.5"
      />
      <InputField label="Поставщик" hint="Кто привёз партию" />
    </FieldGroup>,
  );

  await expect.element(field).toMatchScreenshot();
});
