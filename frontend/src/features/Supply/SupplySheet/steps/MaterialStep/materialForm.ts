import zod from "zod";

import { UnitSchema, type Unit } from "@/features/units";

import type { MaterialDraft, MaterialTypeChoice } from "./materialDraft";
import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";

const NewTypeValue = "new-type";

type MaterialTypeSource = Pick<MaterialTypeModel, "id" | "name">;

interface MaterialFormValues {
  typeId: string | null;
  typeName: string;
  materialName: string;
  variantName: string;
  unit: Unit;
}

const requiredName = (message: string) => zod.string().trim().min(1, message);

export const materialFormDefaults = (
  materialName: string,
): MaterialFormValues => ({
  typeId: null,
  typeName: "",
  materialName: materialName.trim(),
  variantName: "",
  unit: "meters",
});

export const createMaterialFormSchema = (
  types: readonly MaterialTypeSource[],
) => {
  const resolveTypeId = (typeId: string | null) =>
    typeId ?? (types[0] ? String(types[0].id) : NewTypeValue);

  return zod
    .object({
      typeId: zod.string().nullable(),
      typeName: zod.string(),
      materialName: requiredName("Укажите название материала"),
      variantName: requiredName("Укажите название варианта"),
      unit: UnitSchema,
    })
    .superRefine((values, context) => {
      const typeId = resolveTypeId(values.typeId);

      if (typeId === NewTypeValue) {
        if (!values.typeName.trim()) {
          context.addIssue({
            code: "custom",
            path: ["typeName"],
            message: "Укажите название типа",
          });
        }

        return;
      }

      if (!types.some((type) => String(type.id) === typeId)) {
        context.addIssue({
          code: "custom",
          path: ["typeId"],
          message: "Выберите тип",
        });
      }
    })
    .transform((values): MaterialDraft => {
      const typeId = resolveTypeId(values.typeId);
      const selectedType = types.find((type) => String(type.id) === typeId);
      const type: MaterialTypeChoice = selectedType
        ? {
            kind: "existing",
            id: selectedType.id,
            name: selectedType.name,
          }
        : {
            kind: "new",
            name: values.typeName.trim(),
          };

      return {
        type,
        materialName: values.materialName,
        variantName: values.variantName,
        unit: values.unit,
      };
    });
};

export type MaterialFormSchema = ReturnType<typeof createMaterialFormSchema>;
export type { MaterialFormValues };
export { NewTypeValue };
