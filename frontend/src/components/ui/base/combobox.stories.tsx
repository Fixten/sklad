import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentType } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox";
import { Field, FieldError, FieldLabel } from "./field";

interface Material {
  id: string;
  name: string;
}

const sourceMaterials: Material[] = [
  { id: "1", name: "Ель" },
  { id: "2", name: "Дуб" },
  { id: "3", name: "Ясень" },
  { id: "4", name: "Кедр" },
];

const meta = {
  component: Combobox as ComponentType<ComboboxPrimitive.Root.Props<string>>,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

interface RenderComboboxProps {
  items: Material[];
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  showClear?: boolean;
  error?: string;
}

function RenderCombobox(props: RenderComboboxProps) {
  return (
    <Field data-invalid={props.error ? true : undefined}>
      <FieldLabel htmlFor="material-combobox">Материал</FieldLabel>
      <Combobox
        items={ComboboxPrimitive.createItems(props.items, {
          getValue: (material) => material.id,
          getLabel: (material) => material.name,
        })}
        value={props.value}
        onValueChange={props.onValueChange}
      >
        <ComboboxInput
          id="material-combobox"
          placeholder="Материал"
          showClear={props.showClear}
          aria-invalid={props.error ? true : undefined}
        />
        <ComboboxContent>
          <ComboboxList>
            {(material: Material) => (
              <ComboboxItem key={material.id} value={material.id}>
                {material.name}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>Ничего не найдено.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}

export const Default: Story = {
  render: () => (
    <div className="w-56">
      <RenderCombobox items={sourceMaterials} />
    </div>
  ),
};

function ControlledCombobox() {
  const [value, setValue] = useState<string | null>("2");

  return (
    <RenderCombobox
      items={sourceMaterials}
      value={value}
      onValueChange={setValue}
      showClear
    />
  );
}

export const Controlled: Story = {
  render: () => (
    <div className="w-56">
      <ControlledCombobox />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-56">
      <RenderCombobox items={sourceMaterials} error="Выберите материал." />
    </div>
  ),
};

export const EmptyCatalog: Story = {
  render: () => (
    <div className="w-56">
      <RenderCombobox items={[]} />
    </div>
  ),
};
