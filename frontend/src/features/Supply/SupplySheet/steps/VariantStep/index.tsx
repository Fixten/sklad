import { materialTitle } from "@/features/Material/materialUtils/materiaUtils";
import { UnitOptions } from "@/features/units";
import { Button } from "@ui/Button";
import { Form } from "@ui/Form";
import { FormInputField } from "@ui/InputField";
import Panel from "@ui/Panel";
import { FormSelectField } from "@ui/SelectField";

import { useVariantForm } from "./useVariantForm";

import type { MaterialTarget } from "@/features/Material/useMaterialsCatalog";

interface Props {
  material: MaterialTarget;
}

export default function VariantStep({ material }: Props) {
  const { form, busy, submit } = useVariantForm(material);

  return (
    <Panel label="Новый вариант" note={materialTitle(material)}>
      <Form form={form} onSubmit={submit} aria-busy={busy}>
        <div className="grid grid-cols-2 gap-4">
          <FormInputField
            control={form.control}
            name="name"
            label="Вариант"
            autoFocus
          />
          <FormSelectField
            control={form.control}
            name="unit"
            label="Единица"
            options={UnitOptions}
          />
          <Button
            type="submit"
            pending={busy}
            pendingLabel="Создаём…"
            className="col-start-2 justify-self-end"
          >
            Создать и продолжить
          </Button>
        </div>
      </Form>
    </Panel>
  );
}
