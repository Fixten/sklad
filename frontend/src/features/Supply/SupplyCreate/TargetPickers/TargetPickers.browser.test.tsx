import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import type { Control, FieldPath } from "react-hook-form";
import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import type { Routes } from "@/test/apiStub";
import { stubRoutes } from "@/test/apiStub.vitest";
import { Form, useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "../supplyForm";
import type { SupplyDraft, SupplyFormValues } from "../supplyForm";

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

  return <input data-testid={testId} value={String(value ?? "")} readOnly />;
};

interface HarnessProps {
  defaults?: Partial<SupplyFormValues>;
  onChainEdit?: () => void;
  rows?: Rows;
}

const noop = () => undefined;

const Harness = ({ defaults, onChainEdit }: HarnessProps) => {
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
      <TargetPickers onChainEdit={onChainEdit ?? noop} />
      <Probe control={control} name="typeId" testId="type-id" />
      <Probe control={control} name="typeName" testId="type-name" />
      <Probe control={control} name="materialId" testId="material-id" />
      <Probe control={control} name="materialName" testId="material-name" />
      <Probe control={control} name="variantId" testId="variant-id" />
      <Probe control={control} name="variantName" testId="variant-name" />
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

test("filters existing types and labels the create row with the typed name", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").click();
  await expect
    .element(screen.getByRole("option", { name: "Пиломатериал" }))
    .toBeInTheDocument();

  await screen.getByLabelText("Тип").fill("Ясень");
  await expect
    .element(screen.getByRole("option", { name: "Создать тип «Ясень»" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: "Пиломатериал" }))
    .not.toBeInTheDocument();
});

test("hides the create row when an existing name is typed in another case", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").fill("пиломатериал");

  await expect
    .element(screen.getByRole("option", { name: "Пиломатериал" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByRole("option", { name: /Создать тип/ }))
    .not.toBeInTheDocument();
});

test("does not commit typed text", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").fill("Пиломатериал");
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByLabelText("Вариант").fill("Доска 40 мм");

  for (const testId of [
    "type-id",
    "type-name",
    "material-id",
    "material-name",
    "variant-id",
    "variant-name",
    "unit",
  ]) {
    await expect.element(screen.getByTestId(testId)).toHaveValue("");
  }

  await screen.getByRole("button", { name: "Сохранить" }).click();

  await expect
    .element(screen.getByText("Выберите или создайте тип"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте материал"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите или создайте вариант"))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Выберите единицу"))
    .toBeInTheDocument();
});

test("commits a picked result and drops it on edit", async () => {
  const onChainEdit = vi.fn();
  const screen = await renderPickers({ onChainEdit });

  await pickType(screen, "Пиломатериал");

  expect(onChainEdit).toHaveBeenCalled();
  await expect.element(screen.getByTestId("type-id")).toHaveValue("1");
  await expect
    .element(screen.getByLabelText("Тип"))
    .toHaveValue("Пиломатериал");

  await screen.getByLabelText("Тип").fill("Пиломатериал 2");

  await expect.element(screen.getByTestId("type-id")).toHaveValue("");
  await expect.element(screen.getByTestId("type-name")).toHaveValue("");
});

test("reports every picker edit to the chain", async () => {
  const onChainEdit = vi.fn();
  const screen = await renderPickers({ onChainEdit });
  const expectEdit = () => {
    expect(onChainEdit).toHaveBeenCalled();
    onChainEdit.mockClear();
  };

  await pickType(screen, "Пиломатериал");
  expectEdit();

  await pickMaterial(screen, "Дуб");
  expectEdit();

  await pickVariant(screen, "Доска 40 мм");
  expectEdit();

  await screen.getByLabelText("Вариант").fill("Доска 45 мм");
  expectEdit();

  await screen
    .getByRole("option", { name: "Создать вариант «Доска 45 мм»" })
    .click();
  expectEdit();

  await screen.getByRole("combobox", { name: /Единица/ }).click();
  await screen.getByRole("option", { name: "штука" }).click();
  expectEdit();

  await screen.getByLabelText("Материал").fill("Ясень");
  expectEdit();

  await screen.getByRole("option", { name: "Ясень" }).click();
  expectEdit();

  await screen.getByLabelText("Тип").fill("Химия");
  expectEdit();

  await screen.getByRole("option", { name: "Химия" }).click();
  expectEdit();

  await screen.getByLabelText("Тип").fill("Металл");
  expectEdit();

  await screen.getByRole("option", { name: "Создать тип «Металл»" }).click();
  expectEdit();

  await screen.getByLabelText("Материал").fill("Алюминий");
  expectEdit();

  await screen
    .getByRole("option", { name: "Создать материал «Алюминий»" })
    .click();
  expectEdit();
});

test("commits a create row", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").fill("Металл");
  await screen.getByRole("option", { name: "Создать тип «Металл»" }).click();

  await expect.element(screen.getByTestId("type-name")).toHaveValue("Металл");
  await expect.element(screen.getByTestId("type-id")).toHaveValue("");
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
  await expect.element(screen.getByTestId("material-id")).toHaveValue("10");

  await pickType(screen, "Пиломатериал");
  await expect.element(screen.getByTestId("material-id")).toHaveValue("10");
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

  await expect.element(screen.getByTestId("variant-id")).toHaveValue("100");
  await expect.element(screen.getByTestId("unit")).toHaveValue("meters");
});

test("type change clears material and variant", async () => {
  const screen = await renderPickers();
  await commitChain(screen);

  await changeType(screen, "Химия");

  await expect.element(screen.getByTestId("material-id")).toHaveValue("");
  await expect.element(screen.getByTestId("variant-id")).toHaveValue("");
  await expect.element(screen.getByLabelText("Материал")).toHaveValue("");
  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
  await expect.element(screen.getByTestId("unit")).toHaveValue("meters");
});

test("material change clears the variant only", async () => {
  const screen = await renderPickers();
  await commitChain(screen);

  await changeMaterial(screen, "Ясень");

  await expect.element(screen.getByTestId("material-id")).toHaveValue("11");
  await expect.element(screen.getByTestId("variant-id")).toHaveValue("");
  await expect.element(screen.getByTestId("type-id")).toHaveValue("1");
  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");
});

test("offers a create row for a material that exists under another type", async () => {
  const screen = await renderPickers();

  await pickType(screen, "Пиломатериал");
  await screen.getByLabelText("Материал").fill("Краситель");

  await expect
    .element(
      screen.getByRole("option", { name: "Создать материал «Краситель»" }),
    )
    .toBeInTheDocument();
});

test("offers a create row for a variant that exists under another material", async () => {
  const screen = await renderPickers();

  await pickType(screen, "Пиломатериал");
  await pickMaterial(screen, "Ясень");
  await screen.getByLabelText("Вариант").fill("Доска 40 мм");

  await expect
    .element(
      screen.getByRole("option", { name: "Создать вариант «Доска 40 мм»" }),
    )
    .toBeInTheDocument();
});

test("unit change releases an existing variant but keeps a create intent", async () => {
  const screen = await renderPickers();
  await commitChain(screen);

  await screen.getByRole("combobox", { name: /Единица/ }).click();
  await screen.getByRole("option", { name: "штука" }).click();

  await expect.element(screen.getByTestId("variant-id")).toHaveValue("");
  await expect.element(screen.getByLabelText("Вариант")).toHaveValue("");

  await screen.getByLabelText("Вариант").fill("Доска 45 мм");
  await screen
    .getByRole("option", { name: "Создать вариант «Доска 45 мм»" })
    .click();
  await expect
    .element(screen.getByTestId("variant-name"))
    .toHaveValue("Доска 45 мм");

  await screen.getByRole("combobox", { name: /Единица/ }).click();
  await screen.getByRole("option", { name: "метр" }).click();

  await expect
    .element(screen.getByTestId("variant-name"))
    .toHaveValue("Доска 45 мм");
});

test("creates from an empty catalog", async () => {
  const screen = await renderPickers({
    rows: { types: [], materials: [], variants: [] },
  });

  await screen.getByLabelText("Тип").fill("Металл");
  await screen.getByRole("option", { name: "Создать тип «Металл»" }).click();
  await screen.getByLabelText("Материал").fill("Алюминий");
  await screen
    .getByRole("option", { name: "Создать материал «Алюминий»" })
    .click();
  await screen.getByLabelText("Вариант").fill("Лист 2 мм");
  await screen
    .getByRole("option", { name: "Создать вариант «Лист 2 мм»" })
    .click();

  await expect.element(screen.getByTestId("type-name")).toHaveValue("Металл");
  await expect
    .element(screen.getByTestId("material-name"))
    .toHaveValue("Алюминий");
  await expect
    .element(screen.getByTestId("variant-name"))
    .toHaveValue("Лист 2 мм");
  await expect.element(screen.getByTestId("type-id")).toHaveValue("");
  await expect.element(screen.getByTestId("material-id")).toHaveValue("");
  await expect.element(screen.getByTestId("variant-id")).toHaveValue("");
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

test("commits the create row on Enter instead of submitting", async () => {
  const screen = await renderPickers();

  await screen.getByLabelText("Тип").fill("Металл");
  await userEvent.keyboard("{Enter}");

  await expect.element(screen.getByTestId("type-name")).toHaveValue("Металл");
  await expect
    .element(screen.getByText("Укажите количество"))
    .not.toBeInTheDocument();
});
