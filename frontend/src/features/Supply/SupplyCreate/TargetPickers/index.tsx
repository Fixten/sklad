import { useFormContext, useWatch } from "react-hook-form";

import { UnitOptions } from "@/features/units";
import { FormField } from "@ui/Form";
import { FormInputField } from "@ui/InputField";
import { FieldGroup } from "@ui/InputFieldGroup";
import OptionPicker from "@ui/OptionPicker";
import { FormSelectField } from "@ui/SelectField";

import type { SupplyDraft, SupplyFormValues } from "../supplyForm";

interface TypeRow {
  id: number;
  name: string;
}

interface MaterialRow {
  id: number;
  name: string;
  material_type_id: number;
}

interface Props {
  types: TypeRow[];
  materials: MaterialRow[];
}

const matches = (name: string, text: string) =>
  name.toLowerCase().includes(text.trim().toLowerCase());

export default function TargetPickers({ types, materials }: Props) {
  const form = useFormContext<SupplyFormValues, unknown, SupplyDraft>();
  const { control, setValue } = form;
  const typeId = useWatch({ control, name: "typeId" });
  const typeName = useWatch({ control, name: "typeName" });
  const materialId = useWatch({ control, name: "materialId" });
  const materialName = useWatch({ control, name: "materialName" });

  const clearSelection = () => {
    setValue("variantId", null, { shouldDirty: true, shouldValidate: true });
  };

  const resetMaterialLink = () => {
    setValue("materialId", null, { shouldDirty: true, shouldValidate: true });
    setValue("materialName", "", { shouldDirty: true, shouldValidate: true });
  };

  const handleTypeSelect = (type: TypeRow) => {
    if (type.id === typeId) {
      return;
    }
    setValue("typeName", type.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("typeId", type.id, { shouldDirty: true, shouldValidate: true });
    if (materialId !== null) {
      resetMaterialLink();
    }
    clearSelection();
  };

  const handleTypeChange = (text: string) => {
    if (text === typeName) {
      return;
    }
    if (typeId !== null) {
      setValue("typeId", null, { shouldDirty: true, shouldValidate: true });
      if (materialId !== null) {
        resetMaterialLink();
      }
    }
    setValue("typeName", text, { shouldDirty: true, shouldValidate: true });
    clearSelection();
  };

  const typeOptions = types
    .filter((type) => matches(type.name, typeName))
    .map((type) => ({ key: String(type.id), value: type, label: type.name }));

  const scopedMaterials = materials.filter(
    (material) => material.material_type_id === typeId,
  );
  const materialOptions = scopedMaterials
    .filter((material) => matches(material.name, materialName))
    .map((material) => ({
      key: String(material.id),
      value: material,
      label: material.name,
    }));

  const handleMaterialSelect = (material: MaterialRow) => {
    setValue("materialId", material.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("materialName", material.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearSelection();
  };

  const handleMaterialChange = (text: string) => {
    if (text === materialName) {
      return;
    }
    if (materialId !== null) {
      setValue("materialId", null, { shouldDirty: true, shouldValidate: true });
    }
    setValue("materialName", text, { shouldDirty: true, shouldValidate: true });
    clearSelection();
  };

  return (
    <FieldGroup className="grid gap-5 sm:grid-cols-2">
      <FormField
        control={control}
        name="typeName"
        render={({ field, fieldState }) => (
          <OptionPicker
            id="supply-type"
            name={field.name}
            inputRef={field.ref}
            label="Тип"
            placeholder="Тип"
            value={field.value}
            error={fieldState.error?.message}
            listLabel="Типы"
            results={typeOptions}
            onValueChange={handleTypeChange}
            onSelect={handleTypeSelect}
            create={{ createLabel: "Создать тип", onCreate: () => undefined }}
          />
        )}
      />

      {typeId !== null ? (
        <FormField
          control={control}
          name="materialName"
          render={({ field, fieldState }) => (
            <OptionPicker
              id="supply-material-in-type"
              name={field.name}
              inputRef={field.ref}
              label="Материал"
              placeholder="Материал"
              value={field.value}
              error={fieldState.error?.message}
              listLabel="Материалы"
              results={materialOptions}
              onValueChange={handleMaterialChange}
              onSelect={handleMaterialSelect}
              create={{
                createLabel: "Создать материал",
                onCreate: () => undefined,
              }}
            />
          )}
        />
      ) : (
        <FormInputField
          control={control}
          name="materialName"
          label="Материал"
          placeholder="Материал"
          onChange={() => {
            clearSelection();
          }}
        />
      )}

      <FormInputField
        control={control}
        name="variantName"
        label="Вариант"
        placeholder="Вариант"
        onChange={() => {
          clearSelection();
        }}
      />

      <FormSelectField
        control={control}
        name="unit"
        label="Единица"
        options={UnitOptions}
        onValueChange={() => {
          clearSelection();
        }}
      />
    </FieldGroup>
  );
}
