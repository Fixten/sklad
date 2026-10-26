import { expect, test } from "vitest";

import { validateMaterialForm } from "./validation";

test("requires a type, material and variant, and a name for a new type", () => {
  expect(
    validateMaterialForm(
      {
        typeId: "new-type",
        typeName: " ",
        materialName: " ",
        variantName: " ",
      },
      { isNewType: true, hasSelectedType: true },
    ),
  ).toEqual({
    typeName: "Укажите название типа",
    materialName: "Укажите название материала",
    variantName: "Укажите название варианта",
  });
});

test("requires a valid selection when the selected type is no longer available", () => {
  expect(
    validateMaterialForm(
      {
        typeId: "deleted-type",
        typeName: "",
        materialName: "Дуб",
        variantName: "Доска",
      },
      { isNewType: false, hasSelectedType: false },
    ),
  ).toEqual({ typeId: "Выберите тип" });
});

test("accepts trimmed non-empty values for an existing type", () => {
  expect(
    validateMaterialForm(
      {
        typeId: "1",
        typeName: "",
        materialName: " Дуб ",
        variantName: " Доска ",
      },
      { isNewType: false, hasSelectedType: true },
    ),
  ).toEqual({});
});
