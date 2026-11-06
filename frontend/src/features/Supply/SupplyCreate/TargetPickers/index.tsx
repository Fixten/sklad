import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { FieldPath, FieldPathValue } from "react-hook-form";

import useMaterial from "@/features/Material/useMaterial";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import { UnitOptions, type Unit } from "@/features/units";
import useVariant from "@/features/Variant/useVariant";
import { normalizeName } from "@/lib/text/text";
import { FieldGroup } from "@ui/InputFieldGroup";
import OptionPicker from "@ui/OptionPicker";
import { FormSelectField } from "@ui/SelectField";

import type { SupplyDraft, SupplyFormValues } from "../supplyForm";

interface Props {
  onChainEdit: () => void;
}

const writeOptions = { shouldDirty: true, shouldValidate: true };

const matches = (name: string, text: string) =>
  name.toLowerCase().includes(text.trim().toLowerCase());

const hasExact = (rows: { name: string }[], text: string) => {
  const normalized = normalizeName(text);

  return rows.some((row) => normalizeName(row.name) === normalized);
};

export default function TargetPickers({ onChainEdit }: Props) {
  const { materials } = useMaterial();
  const { types } = useMaterialType();
  const { variants } = useVariant();
  const { control, setValue } = useFormContext<
    SupplyFormValues,
    unknown,
    SupplyDraft
  >();

  const typeQuery = useWatch({ control, name: "typeQuery" });
  const typeId = useWatch({ control, name: "typeId" });
  const typeName = useWatch({ control, name: "typeName" });
  const materialQuery = useWatch({ control, name: "materialQuery" });
  const materialId = useWatch({ control, name: "materialId" });
  const materialName = useWatch({ control, name: "materialName" });
  const variantQuery = useWatch({ control, name: "variantQuery" });
  const variantId = useWatch({ control, name: "variantId" });
  const variantName = useWatch({ control, name: "variantName" });

  const scopedMaterials =
    typeId === null
      ? []
      : materials.filter((material) => material.material_type_id === typeId);

  const scopedVariants =
    materialId === null
      ? []
      : variants.filter((variant) => variant.material_id === materialId);

  const write = <TName extends FieldPath<SupplyFormValues>>(
    name: TName,
    value: FieldPathValue<SupplyFormValues, TName>,
  ) => {
    setValue(name, value, writeOptions);
  };

  const clearMaterial = () => {
    write("materialQuery", "");
    write("materialId", null);
    write("materialName", "");
  };

  const clearVariant = () => {
    write("variantQuery", "");
    write("variantId", null);
    write("variantName", "");
  };

  const chooseType = (nextTypeId: number) => {
    const type = types.find((candidate) => candidate.id === nextTypeId);

    if (!type) return;
    if (type.id === typeId && typeName === "") return;

    const changed = type.id !== typeId;

    write("typeId", type.id);
    write("typeName", "");
    write("typeQuery", type.name);

    if (changed) {
      clearMaterial();
      clearVariant();
    }

    onChainEdit();
  };

  const editType = (text: string) => {
    if (text === typeQuery) return;

    const wasCommitted = typeId !== null || typeName !== "";

    write("typeQuery", text);
    write("typeId", null);
    write("typeName", "");

    if (wasCommitted) {
      clearMaterial();
      clearVariant();
    }

    onChainEdit();
  };

  const createType = () => {
    const name = typeQuery.trim();

    if (name === "" || typeName === name) return;

    const wasCommitted = typeId !== null || typeName !== "";

    write("typeId", null);
    write("typeName", name);

    if (wasCommitted) {
      clearMaterial();
      clearVariant();
    }

    onChainEdit();
  };

  const chooseMaterial = (nextMaterialId: number) => {
    const material = scopedMaterials.find(
      (candidate) => candidate.id === nextMaterialId,
    );

    if (!material) return;
    if (material.id === materialId && materialName === "") return;

    const changed = material.id !== materialId;

    write("materialId", material.id);
    write("materialName", "");
    write("materialQuery", material.name);

    if (changed) {
      clearVariant();
    }

    onChainEdit();
  };

  const editMaterial = (text: string) => {
    if (text === materialQuery) return;

    const wasCommitted = materialId !== null || materialName !== "";

    write("materialQuery", text);
    write("materialId", null);
    write("materialName", "");

    if (wasCommitted) {
      clearVariant();
    }

    onChainEdit();
  };

  const createMaterial = () => {
    const name = materialQuery.trim();

    if (name === "" || materialName === name) return;

    const wasCommitted = materialId !== null || materialName !== "";

    write("materialId", null);
    write("materialName", name);

    if (wasCommitted) {
      clearVariant();
    }

    onChainEdit();
  };

  const chooseVariant = (nextVariantId: number) => {
    const variant = scopedVariants.find(
      (candidate) => candidate.id === nextVariantId,
    );

    if (!variant) return;
    if (variant.id === variantId && variantName === "") return;

    write("variantId", variant.id);
    write("variantName", "");
    write("variantQuery", variant.name);
    write("unit", variant.unit);

    onChainEdit();
  };

  const editVariant = (text: string) => {
    if (text === variantQuery) return;

    write("variantQuery", text);
    write("variantId", null);
    write("variantName", "");

    onChainEdit();
  };

  const createVariant = () => {
    const name = variantQuery.trim();

    if (name === "" || variantName === name) return;

    write("variantId", null);
    write("variantName", name);

    onChainEdit();
  };

  const changeUnit = (unit: Unit) => {
    write("unit", unit);

    if (variantId !== null) {
      write("variantId", null);
      write("variantName", "");
      write("variantQuery", "");
    }

    onChainEdit();
  };

  const typeResults = types
    .filter((type) => matches(type.name, typeQuery))
    .map((type) => ({ value: type.id, label: type.name }));

  const materialResults = scopedMaterials
    .filter((material) => matches(material.name, materialQuery))
    .map((material) => ({ value: material.id, label: material.name }));

  const variantResults = scopedVariants
    .filter((variant) => matches(variant.name, variantQuery))
    .map((variant) => ({ value: variant.id, label: variant.name }));

  const typeCreate =
    typeQuery.trim().length > 0 && !hasExact(types, typeQuery)
      ? {
          createLabel: `Создать тип «${typeQuery.trim()}»`,
          onCreate: createType,
        }
      : undefined;

  const materialCreate =
    materialQuery.trim().length > 0 && !hasExact(scopedMaterials, materialQuery)
      ? {
          createLabel: `Создать материал «${materialQuery.trim()}»`,
          onCreate: createMaterial,
        }
      : undefined;

  const variantCreate =
    variantQuery.trim().length > 0 && !hasExact(scopedVariants, variantQuery)
      ? {
          createLabel: `Создать вариант «${variantQuery.trim()}»`,
          onCreate: createVariant,
        }
      : undefined;

  return (
    <FieldGroup className="grid gap-5 sm:grid-cols-2">
      <Controller
        control={control}
        name="typeName"
        render={({ field, fieldState }) => (
          <OptionPicker
            id="supply-type"
            name={field.name}
            inputRef={field.ref}
            label="Тип"
            placeholder="Тип"
            query={typeQuery}
            error={fieldState.error?.message}
            listLabel="Типы"
            options={typeResults}
            onQueryChange={editType}
            onSelect={chooseType}
            create={typeCreate}
          />
        )}
      />

      <Controller
        control={control}
        name="materialName"
        render={({ field, fieldState }) => (
          <OptionPicker
            id="supply-material"
            name={field.name}
            inputRef={field.ref}
            label="Материал"
            placeholder="Материал"
            query={materialQuery}
            error={fieldState.error?.message}
            listLabel="Материалы"
            options={materialResults}
            onQueryChange={editMaterial}
            onSelect={chooseMaterial}
            create={materialCreate}
          />
        )}
      />

      <Controller
        control={control}
        name="variantName"
        render={({ field, fieldState }) => (
          <OptionPicker
            id="supply-variant"
            name={field.name}
            inputRef={field.ref}
            label="Вариант"
            placeholder="Вариант"
            query={variantQuery}
            error={fieldState.error?.message}
            listLabel="Варианты"
            options={variantResults}
            onQueryChange={editVariant}
            onSelect={chooseVariant}
            create={variantCreate}
          />
        )}
      />

      <FormSelectField
        control={control}
        name="unit"
        label="Единица"
        options={UnitOptions}
        onValueChange={(value) => {
          changeUnit(value as Unit);
        }}
      />
    </FieldGroup>
  );
}
