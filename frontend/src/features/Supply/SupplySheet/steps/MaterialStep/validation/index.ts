export interface MaterialFormValues {
  typeId: string;
  typeName: string;
  materialName: string;
  variantName: string;
}

export type MaterialField = keyof MaterialFormValues;

export type MaterialFormErrors = Partial<Record<MaterialField, string>>;

interface ValidationOptions {
  isNewType: boolean;
  hasSelectedType: boolean;
}

export function validateMaterialForm(
  values: MaterialFormValues,
  { isNewType, hasSelectedType }: ValidationOptions,
): MaterialFormErrors {
  const errors: MaterialFormErrors = {};

  if (!hasSelectedType) {
    errors.typeId = "Выберите тип";
  }

  if (isNewType && !values.typeName.trim()) {
    errors.typeName = "Укажите название типа";
  }

  if (!values.materialName.trim()) {
    errors.materialName = "Укажите название материала";
  }

  if (!values.variantName.trim()) {
    errors.variantName = "Укажите название варианта";
  }

  return errors;
}
