import { useState } from "react";

import { UnitOptions, type Unit } from "@/features/units";
import { Button } from "@ui/Button";
import { InputField } from "@ui/InputField";
import Panel from "@ui/Panel";
import SelectField from "@ui/SelectField";

import { validateMaterialForm } from "./validation";

import type { MaterialField, MaterialFormErrors } from "./validation";
import type {
  MaterialDraft,
  MaterialTypeChoice,
} from "../SupplySheet/materialDraft";
import type { SubmitEvent } from "react";

const NewTypeValue = "new-type";

interface Props {
  types: { id: number; name: string }[];
  initialName: string;
  pending: boolean;
  onCreate: (draft: MaterialDraft) => Promise<void>;
}

const isUnit = (value: string): value is Unit =>
  UnitOptions.some((option) => option.value === value);

export default function MaterialStep({
  types,
  initialName,
  pending,
  onCreate,
}: Props) {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [typeName, setTypeName] = useState("");
  const [materialName, setMaterialName] = useState(initialName);
  const [variantName, setVariantName] = useState("");
  const [unit, setUnit] = useState<Unit>("meters");
  const [errors, setErrors] = useState<MaterialFormErrors>({});

  const typeId =
    selectedTypeId ?? (types[0] ? String(types[0].id) : NewTypeValue);
  const isNewType = typeId === NewTypeValue;
  const typeOptions = [
    ...types.map((type) => ({
      value: String(type.id),
      label: type.name,
    })),
    { value: NewTypeValue, label: "+ Новый тип" },
  ];

  const clearError = (field: MaterialField) => {
    setErrors((current) => {
      if (!current[field]) return current;

      return { ...current, [field]: undefined };
    });
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const selectedType = types.find((type) => String(type.id) === typeId);
    const type: MaterialTypeChoice | null = isNewType
      ? { kind: "new", name: typeName.trim() }
      : selectedType
        ? {
            kind: "existing",
            id: selectedType.id,
            name: selectedType.name,
          }
        : null;
    const nextErrors = validateMaterialForm(
      { typeId, typeName, materialName, variantName },
      {
        isNewType,
        hasSelectedType: type !== null,
      },
    );

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !type) return;

    void onCreate({
      type,
      materialName: materialName.trim(),
      variantName: variantName.trim(),
      unit,
    });
  };

  return (
    <Panel label="Новый материал">
      <form onSubmit={submit} aria-busy={pending || undefined}>
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Тип"
            options={typeOptions}
            value={typeId}
            error={errors.typeId}
            onValueChange={(next) => {
              setSelectedTypeId(next);
              clearError("typeId");
              clearError("typeName");
            }}
          />
          {isNewType ? (
            <InputField
              label="Название типа"
              value={typeName}
              error={errors.typeName}
              autoFocus
              onChange={(event) => {
                setTypeName(event.target.value);
                setSelectedTypeId(NewTypeValue);
                clearError("typeName");
              }}
            />
          ) : null}
          <InputField
            label="Материал"
            value={materialName}
            error={errors.materialName}
            onChange={(event) => {
              setMaterialName(event.target.value);
              clearError("materialName");
            }}
          />
          <InputField
            label="Вариант"
            value={variantName}
            error={errors.variantName}
            onChange={(event) => {
              setVariantName(event.target.value);
              clearError("variantName");
            }}
          />
          <SelectField
            label="Единица"
            options={UnitOptions}
            value={unit}
            onValueChange={(next) => {
              if (isUnit(next)) setUnit(next);
            }}
          />
          <Button
            type="submit"
            disabled={pending}
            className="col-start-2 justify-self-end"
          >
            Создать и продолжить
          </Button>
        </div>
      </form>
    </Panel>
  );
}
