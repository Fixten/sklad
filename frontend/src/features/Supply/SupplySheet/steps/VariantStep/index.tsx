import { useState } from "react";

import { materialTitle } from "@/features/Material/materialUtils/materiaUtils";
import { UnitOptions, type Unit } from "@/features/units";
import { Button } from "@ui/Button";
import { InputField } from "@ui/InputField";
import Panel from "@ui/Panel";
import SelectField from "@ui/SelectField";

import { useVariantStep } from "./useVariantStep";

import type { MaterialTarget } from "@/features/Material/useMaterialsCatalog";

interface Props {
  material: MaterialTarget;
}

export default function VariantStep({ material }: Props) {
  const { pending, create } = useVariantStep(material);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<Unit>("meters");
  const [error, setError] = useState<string>();

  const submit = () => {
    if (pending) return;

    if (!name.trim()) {
      setError("Укажите название варианта");
      return;
    }

    setError(undefined);
    void create(name.trim(), unit);
  };

  return (
    <Panel label="Новый вариант" note={materialTitle(material)}>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Вариант"
          value={name}
          error={error}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <SelectField
          label="Единица"
          options={UnitOptions}
          value={unit}
          onValueChange={(next) => {
            setUnit(next as Unit);
          }}
        />
        <Button
          pending={pending}
          pendingLabel="Создаём…"
          className="col-start-2 justify-self-end"
          onClick={submit}
        >
          Создать и продолжить
        </Button>
      </div>
    </Panel>
  );
}
