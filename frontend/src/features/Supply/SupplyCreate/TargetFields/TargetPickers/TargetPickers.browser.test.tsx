import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import type { Control, FieldPath } from "react-hook-form";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import type { Routes } from "@/test/apiStub";
import { stubRoutes } from "@/test/apiStub.vitest";
import { Form, useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "../../supplyForm";
import type { SupplyDraft, SupplyFormValues } from "../../supplyForm";

import TargetPickers from ".";

const supplyFormSchema = createSupplyFormSchema();
const createdAt = "2026-01-01T00:00:00Z";

const types = [
  { id: 1, name: "Пиломатериал", created_at: createdAt },
  { id: 2, name: "Химия", created_at: createdAt },
];
const materials = [
  { id: 10, name: "Дуб", material_type_id: 1, created_at: createdAt },
  { id: 11, name: "Ясень", material_type_id: 1, created_at: createdAt },
  { id: 20, name: "Краситель", material_type_id: 2, created_at: createdAt },
];
const variants = [
  {
    id: 100,
    name: "Доска 40 мм",
    material_id: 10,
    unit: "meters" as const,
    created_at: createdAt,
  },
  {
    id: 102,
    name: "Рейка 20 × 40",
    material_id: 10,
    unit: "pieces" as const,
    created_at: createdAt,
  },
];

interface Rows {
  types: typeof types;
  materials: typeof materials;
  variants: typeof variants;
}

interface ProbeProps {
  control: Control<SupplyFormValues, unknown, SupplyDraft>;
  name: FieldPath<SupplyFormValues>;
  testId: string;
}

const Probe = ({ control, name, testId }: ProbeProps) => {
  const value = useWatch({ control, name });

  return <input data-testid={testId} value={value ?? ""} readOnly />;
};

interface HarnessProps {
  defaults?: Partial<SupplyFormValues>;
  rows?: Rows;
}

const Harness = ({ defaults }: HarnessProps) => {
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: { ...supplyFormDefaults, ...defaults },
  });
  const { control } = form;

  return (
    <Form
      form={form}
      onSubmit={() => undefined}
      className="flex flex-col gap-8"
    >
      <TargetPickers />
      <Probe control={control} name="type" testId="type" />
      <Probe control={control} name="material" testId="material" />
      <Probe control={control} name="variant" testId="variant" />
      <Probe control={control} name="unit" testId="unit" />
      <button type="submit">Сохранить</button>
    </Form>
  );
};

const defaultRows: Rows = { types, materials, variants };

const pickerRoutes = (rows: Rows): Routes => ({
  "/api/material-type": { get: () => rows.types },
  "/api/material": { get: () => rows.materials },
  "/api/material-variant": { get: () => rows.variants },
});

const renderPickers = (props?: HarnessProps) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  stubRoutes(pickerRoutes(props?.rows ?? defaultRows));

  return render(
    <QueryClientProvider client={queryClient}>
      <Harness {...props} />
    </QueryClientProvider>,
  );
};

type Screen = Awaited<ReturnType<typeof renderPickers>>;

const pickType = async (screen: Screen, name: string) => {
  await screen.getByLabelText("Тип").click();
  await screen.getByRole("option", { name }).click();
};

const pickMaterial = async (screen: Screen, name: string) => {
  await screen.getByLabelText("Материал").click();
  await screen.getByRole("option", { name }).click();
};

const pickVariant = async (screen: Screen, name: string) => {
  await screen.getByLabelText("Вариант").click();
  await screen.getByRole("option", { name }).click();
};

const commitChain = async (screen: Screen) => {
  await pickType(screen, "Пиломатериал");
  await pickMaterial(screen, "Дуб");
  await pickVariant(screen, "Доска 40 мм");
};

const changeType = async (screen: Screen, name: string) => {
  await screen.getByLabelText("Тип").fill(name);
  await screen.getByRole("option", { name }).click();
};

const changeMaterial = async (screen: Screen, name: string) => {
  await screen.getByLabelText("Материал").fill(name);
  await screen.getByRole("option", { name }).click();
};

test("commits typed text as a new value via the create row", async () => {
  const screen = await renderPickers();

  const type = screen.getByLabelText("Тип");
  await type.click();
  await type.fill("Новый тип");
  await screen.getByRole("option", { name: "Создать Новый тип" }).click();

  await expect.element(type).toHaveValue("Новый тип");
  await expect.element(screen.getByTestId("type")).toHaveValue("Новый тип");

  const material = screen.getByLabelText("Материал");
  await material.click();
  await material.fill("Новый материал");
  await screen.getByRole("option", { name: "Создать Новый материал" }).click();

  await expect
    .element(screen.getByTestId("material"))
    .toHaveValue("Новый материал");

  const variant = screen.getByLabelText("Вариант");
  await variant.click();
  await variant.fill("Новый вариант");
  await screen.getByRole("option", { name: "Создать Новый вариант" }).click();

  await expect
    .element(screen.getByTestId("variant"))
    .toHaveValue("Новый вариант");

  await expect.element(screen.getByTestId("unit")).toHaveValue("");
  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toBeEnabled();
});

test("commits a picked result and drops it on edit", async () => {
  const screen = await renderPickers();

  await pickType(screen, "Пиломатериал");

  await expect
    .element(screen.getByLabelText("Тип"))
    .toHaveValue("Пиломатериал");
  await expect.element(screen.getByTestId("type")).toHaveValue("Пиломатериал");

  await screen.getByLabelText("Тип").fill("Пиломатериал 2");

  await expect.element(screen.getByTestId("type")).toHaveValue("");
});

test("scopes materials to the picked type and keeps them on a same-id re-pick", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Материал").click();
  await expect.element(screen.getByRole("option")).not.toBeInTheDocument();

  await pickType(screen, "Пиломатериал");

  await screen.getByLabelText("Материал").click();
  await expect
    .element(screen.getByRole("option", { name: "Дуб" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: "Ясень" }))
    .toBeInTheDocument();

  await screen.getByRole("option", { name: "Дуб" }).click();
  await expect.element(screen.getByTestId("material")).toHaveValue("Дуб");

  await pickType(screen, "Пиломатериал");
  await expect.element(screen.getByTestId("material")).toHaveValue("Дуб");
});

test("scopes variants to the picked material and seeds the unit", async () => {
  const screen = await renderPickers();

  await pickType(screen, "Пиломатериал");
  await pickMaterial(screen, "Дуб");

  await screen.getByLabelText("Вариант").click();
  await expect
    .element(screen.getByRole("option", { name: "Доска 40 мм" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: "Рейка 20 × 40" }))
    .toBeInTheDocument();

  await screen.getByRole("option", { name: "Доска 40 мм" }).click();

  await expect
    .element(screen.getByTestId("variant"))
    .toHaveValue("Доска 40 мм");
  await expect.element(screen.getByTestId("unit")).toHaveValue("meters");
});

test("type change clears material and variant", async () => {
  const screen = await renderPickers();
  await commitChain(screen);

  await changeType(screen, "Химия");

  await expect.element(screen.getByTestId("material")).toHaveValue("");
  await expect.element(screen.getByTestId("variant")).toHaveValue("");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("");
  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
  await expect.element(screen.getByTestId("unit")).toHaveValue("");
  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toBeEnabled();
});

test("material change clears the variant only", async () => {
  const screen = await renderPickers();
  await commitChain(screen);

  await changeMaterial(screen, "Ясень");

  await expect.element(screen.getByTestId("material")).toHaveValue("Ясень");
  await expect.element(screen.getByTestId("variant")).toHaveValue("");
  await expect.element(screen.getByTestId("type")).toHaveValue("Пиломатериал");
  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

test("locks the unit for a committed existing variant", async () => {
  const screen = await renderPickers();
  await commitChain(screen);

  await expect.element(screen.getByTestId("unit")).toHaveValue("meters");
  await expect
    .element(screen.getByRole("combobox", { name: /Единица/ }))
    .toBeDisabled();
});

test("revalidates after a failed submit", async () => {
  const screen = await renderPickers();

  await screen.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .toBeInTheDocument();

  await pickType(screen, "Пиломатериал");

  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .not.toBeInTheDocument();
});
