import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { InputField } from "./index";

const resolvedColor = (value: string) => {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();

  return color;
};

const asInput = (element: HTMLElement | SVGElement) => {
  if (!(element instanceof HTMLInputElement)) {
    throw new Error("the locator does not point at an input");
  }

  return element;
};

const groupOf = (input: HTMLInputElement) => {
  const group = input.closest<HTMLElement>('[data-slot="input-group"]');
  if (!group) throw new Error("the control is not inside an input group");

  return group;
};

const describedText = (input: HTMLInputElement) => {
  const describedBy = input.getAttribute("aria-describedby");
  if (!describedBy) return [];

  return describedBy.split(" ").map((id) => {
    const target = document.getElementById(id);
    if (!target) throw new Error(`nothing describes "${id}"`);

    return target.textContent;
  });
};

test("names the control from its label", async () => {
  const screen = await render(<InputField label="Количество" />);

  await expect
    .element(screen.getByRole("textbox"))
    .toMatchAriaInlineSnapshot(`- textbox "Количество"`);
});

test("describes the control with its unit and hint", async () => {
  const screen = await render(
    <InputField label="Количество" unit="кг" hint="Можно дробное: 12,5" />,
  );

  const input = asInput(screen.getByRole("textbox").element());

  expect(describedText(input)).toEqual(["кг", "Можно дробное: 12,5"]);
});

test("trades the hint for the error when the field is invalid", async () => {
  const screen = await render(
    <InputField
      label="Материал"
      hint="Например: Дуб, ясень, берёза"
      error="Укажите материал или создайте новый"
    />,
  );

  const input = screen.getByRole("textbox");

  await expect.element(input).toHaveAttribute("aria-invalid", "true");
  expect(describedText(asInput(input.element()))).toEqual([
    "Укажите материал или создайте новый",
  ]);
  expect(screen.getByText("Например: Дуб, ясень, берёза").query()).toBeNull();
});

test("announces the error as an alert", async () => {
  const screen = await render(
    <InputField label="Количество" error="Укажите количество — от 0,01" />,
  );

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Укажите количество — от 0,01");
});

test("keeps the hint as the description while the field is valid", async () => {
  const screen = await render(
    <InputField label="Поставщик" hint="Кто привёз партию" />,
  );

  const input = asInput(screen.getByRole("textbox").element());

  expect(describedText(input)).toEqual(["Кто привёз партию"]);
  expect(screen.getByRole("alert").query()).toBeNull();
});

test("keeps a disabled field uneditable", async () => {
  const screen = await render(
    <InputField
      label="Единица измерения"
      defaultValue="Метры"
      disabled
      unit="м"
    />,
  );

  await expect.element(screen.getByRole("textbox")).toBeDisabled();
});

test("forwards the required state", async () => {
  const screen = await render(<InputField label="Поставщик" required />);

  await expect
    .element(screen.getByRole("textbox"))
    .toHaveAttribute("required", "");
});

test("takes typed text", async () => {
  const screen = await render(<InputField label="Материал" />);

  const input = screen.getByRole("textbox");
  await input.fill("Ясень");

  await expect.element(input).toHaveValue("Ясень");
});

test("wires a number control for decimal entry", async () => {
  const screen = await render(
    <InputField
      label="Цена закупки"
      unit="₽"
      type="number"
      min={0}
      step={0.01}
      inputMode="decimal"
    />,
  );

  const input = screen.getByRole("spinbutton");

  await expect.element(input).toHaveAttribute("type", "number");
  await expect.element(input).toHaveAttribute("inputmode", "decimal");
  await expect.element(input).toHaveAttribute("step", "0.01");
  await expect.element(input).toHaveAttribute("min", "0");
  expect(getComputedStyle(input.element()).fontVariantNumeric).toContain(
    "tabular-nums",
  );
});

test("drops focus on a number control when the wheel rolls", async () => {
  const screen = await render(
    <InputField label="Количество" type="number" defaultValue="12.5" />,
  );

  const input = asInput(screen.getByRole("spinbutton").element());
  input.focus();
  expect(document.activeElement).toBe(input);

  input.dispatchEvent(new WheelEvent("wheel", { bubbles: true }));

  expect(document.activeElement).not.toBe(input);
  expect(input.value).toBe("12.5");
});

test("draws the resting underline with the input token", async () => {
  const screen = await render(<InputField label="Материал" />);

  const group = groupOf(asInput(screen.getByRole("textbox").element()));

  expect(getComputedStyle(group).borderBottomWidth).toBe("1px");
  expect(getComputedStyle(group).borderBottomColor).toBe(
    resolvedColor("var(--input)"),
  );
});

test("switches the underline to the invalid token", async () => {
  const screen = await render(
    <InputField label="Материал" error="Укажите материал" />,
  );

  const group = groupOf(asInput(screen.getByRole("textbox").element()));

  expect(getComputedStyle(group).borderBottomColor).toBe(
    resolvedColor("var(--invalid)"),
  );
});

test("switches the underline to the focus token", async () => {
  const screen = await render(<InputField label="Материал" />);

  const input = asInput(screen.getByRole("textbox").element());
  input.focus();

  expect(getComputedStyle(groupOf(input)).borderBottomColor).toBe(
    resolvedColor("var(--ring)"),
  );
});

test("binds the caret to the focus token", async () => {
  const screen = await render(<InputField label="Материал" />);

  // The browser and vrt projects freeze carets with `caret-color: transparent
  // !important`, so the binding is asserted on the class list instead.
  const input = asInput(screen.getByRole("textbox").element());

  expect(input.classList.contains("caret-ring")).toBe(true);
});

test("generates a unique id per field and points the label at it", async () => {
  const screen = await render(
    <>
      <InputField label="Материал" />
      <InputField label="Поставщик" />
    </>,
  );

  const [material, supplier] = [
    screen.getByRole("textbox", { name: "Материал" }).element(),
    screen.getByRole("textbox", { name: "Поставщик" }).element(),
  ];

  expect(material.id).not.toBe("");
  expect(material.id).not.toBe(supplier.id);
  expect(document.querySelector(`label[for="${material.id}"]`)).not.toBeNull();
  expect(document.querySelector(`label[for="${supplier.id}"]`)).not.toBeNull();
});

test("honours an explicit id", async () => {
  const screen = await render(
    <InputField label="Количество" id="supply-quantity" />,
  );

  await expect
    .element(screen.getByRole("textbox"))
    .toHaveAttribute("id", "supply-quantity");
  expect(document.querySelector('label[for="supply-quantity"]')).not.toBeNull();
});
