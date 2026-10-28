import { expect, test } from "vitest";
import zod from "zod";

import { createMaterialFormSchema, NewTypeValue } from "./materialForm";

import type { MaterialFormValues } from "./materialForm";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";

const types: Pick<MaterialTypeModel, "id" | "name">[] = [
  { id: 1, name: "Пиломатериал" },
  { id: 2, name: "Фурнитура" },
];

const values = (
  patch: Partial<MaterialFormValues> = {},
): MaterialFormValues => ({
  typeId: "1",
  typeName: "",
  materialName: "Дуб",
  variantName: "Доска",
  unit: "meters",
  ...patch,
});

const errorsOf = (
  result: ReturnType<ReturnType<typeof createMaterialFormSchema>["safeParse"]>,
) => (result.success ? {} : zod.flattenError(result.error).fieldErrors);

test("requires material, variant and a name for a new type", () => {
  const result = createMaterialFormSchema(types).safeParse(
    values({
      typeId: NewTypeValue,
      typeName: " ",
      materialName: " ",
      variantName: " ",
    }),
  );

  expect(errorsOf(result)).toEqual({
    typeName: ["Укажите название типа"],
    materialName: ["Укажите название материала"],
    variantName: ["Укажите название варианта"],
  });
});

test("rejects a selected type that is no longer available", () => {
  const result = createMaterialFormSchema(types).safeParse(
    values({ typeId: "deleted-type" }),
  );

  expect(errorsOf(result)).toEqual({ typeId: ["Выберите тип"] });
});

test("resolves the implicit selection to the first existing type", () => {
  const result = createMaterialFormSchema(types).safeParse(
    values({ typeId: null }),
  );

  expect(result.data).toEqual({
    type: { kind: "existing", id: 1, name: "Пиломатериал" },
    materialName: "Дуб",
    variantName: "Доска",
    unit: "meters",
  });
});

test("trims names and returns the selected existing type", () => {
  const result = createMaterialFormSchema(types).safeParse(
    values({ materialName: " Дуб ", variantName: " Доска ", unit: "pieces" }),
  );

  expect(result.data).toEqual({
    type: { kind: "existing", id: 1, name: "Пиломатериал" },
    materialName: "Дуб",
    variantName: "Доска",
    unit: "pieces",
  });
});

test("creates a new type from trimmed input", () => {
  const result = createMaterialFormSchema(types).safeParse(
    values({ typeId: NewTypeValue, typeName: " Древесина " }),
  );

  expect(result.data).toMatchObject({
    type: { kind: "new", name: "Древесина" },
  });
});

test("requires a new type name when no types are loaded", () => {
  const schema = createMaterialFormSchema([]);

  expect(
    errorsOf(schema.safeParse(values({ typeId: null, typeName: " " }))),
  ).toEqual({ typeName: ["Укажите название типа"] });
  expect(
    schema.safeParse(values({ typeId: null, typeName: "Древесина" })).data,
  ).toMatchObject({ type: { kind: "new", name: "Древесина" } });
});

test("rejects an unsupported unit", () => {
  const result = createMaterialFormSchema(types).safeParse({
    ...values(),
    unit: "kilograms",
  });

  expect(result.success).toBe(false);
  expect(errorsOf(result).unit).toHaveLength(1);
});
