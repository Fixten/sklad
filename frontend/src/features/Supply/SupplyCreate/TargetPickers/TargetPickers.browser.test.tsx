import { useWatch } from "react-hook-form";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Form, useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "../supplyForm";

import TargetPickers from ".";

import type { SupplyFormValues } from "../supplyForm";

const supplyFormSchema = createSupplyFormSchema();

const types = [{ id: 1, name: "Пиломатериал" }];
const materials = [{ id: 10, name: "Дуб", material_type_id: 1 }];

const Harness = (props: { defaults?: Partial<SupplyFormValues> }) => {
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: { ...supplyFormDefaults, ...props.defaults },
  });
  const materialId = useWatch({ control: form.control, name: "materialId" });

  return (
    <Form
      form={form}
      onSubmit={() => undefined}
      className="flex flex-col gap-8"
    >
      <TargetPickers types={types} materials={materials} />
      <input
        data-testid="material-id-probe"
        value={String(materialId ?? "")}
        readOnly
      />
      <button type="submit">Сохранить</button>
    </Form>
  );
};

const renderPickers = (defaults?: Partial<SupplyFormValues>) =>
  render(<Harness defaults={defaults} />);

test("filters existing types and offers creating a typed one", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").click();
  await expect
    .element(screen.getByRole("option", { name: "Пиломатериал" }))
    .toBeInTheDocument();

  await screen.getByLabelText("Тип").fill("Ясень");
  await expect
    .element(screen.getByRole("option", { name: "Создать тип" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: "Пиломатериал" }))
    .not.toBeInTheDocument();
});

test("shows the material combobox only for an existing type", async () => {
  const screen = await renderPickers();

  const material = screen.getByLabelText("Материал");
  await expect.element(material).not.toHaveAttribute("role", "combobox");

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();

  await expect
    .element(screen.getByLabelText("Материал"))
    .toHaveAttribute("role", "combobox");
});

test("scopes materials to the chosen type", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();

  await screen.getByLabelText("Материал").click();
  await expect
    .element(screen.getByRole("option", { name: "Дуб" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: "Создать материал" }))
    .toBeInTheDocument();

  await screen.getByRole("option", { name: "Дуб" }).click();
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("Дуб");
});

test("keeps the linked material when the type is re-picked", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();

  await screen.getByLabelText("Материал").click();
  await screen.getByRole("option", { name: "Дуб" }).click();

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();

  await expect
    .element(screen.getByTestId("material-id-probe"))
    .toHaveValue("10");

  await screen.getByLabelText("Вариант").fill("Доска 50 мм");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .not.toBeInTheDocument();
});

test("revalidates picker fields after a failed submit", async () => {
  const screen = await renderPickers({
    variantName: "Доска 40 мм",
    unit: "pieces",
  });

  await screen.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .toBeInTheDocument();

  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name: "Пиломатериал" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .not.toBeInTheDocument();
});

test("keeps material free text when the type is new", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").fill("Ясень");

  await screen.getByLabelText("Материал").fill("Ясень 40");
  await expect
    .element(screen.getByLabelText("Материал"))
    .toHaveValue("Ясень 40");
});

test("reports missing parts on validation", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Вариант").fill("Доска 40 мм");
  await screen.getByRole("combobox", { name: /Единица/ }).click();
  await screen.getByRole("option", { name: "штука" }).click();
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .toBeInTheDocument();
});

test("clears the query selection when a picker changes", async () => {
  const screen = await renderPickers({
    variantId: 100,
    typeId: 1,
    typeName: "Пиломатериал",
    materialId: 10,
    materialName: "Дуб",
    variantName: "Доска 40 мм",
    unit: "meters",
  });

  await screen.getByLabelText("Вариант").fill("Доска 50 мм");
  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText(/Выберите или создайте/))
    .not.toBeInTheDocument();
});
