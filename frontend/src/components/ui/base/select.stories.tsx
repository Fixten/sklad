import { useState } from "react";

import { Field, FieldError } from "./field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

const materials = ["Ель", "Дуб", "Ясень", "Кедр"] as const;
const materialOptions = materials.map((material) => ({
  value: material,
  label: material,
}));

function ControlledSelect() {
  const [value, setValue] = useState<string | null>("Дуб");

  return (
    <Select items={materialOptions} value={value} onValueChange={setValue}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Материал" />
      </SelectTrigger>
      <SelectContent>
        {materialOptions.map((material) => (
          <SelectItem key={material.value} value={material.value}>
            {material.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export const Default: Story = {
  render: () => (
    <Select items={materialOptions}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Материал" />
      </SelectTrigger>
      <SelectContent>
        {materialOptions.map((material) => (
          <SelectItem key={material.value} value={material.value}>
            {material.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledSelect />,
};

export const Grouped: Story = {
  render: () => (
    <Select
      items={[
        { value: "larch", label: "Ель" },
        { value: "oak", label: "Дуб" },
        { value: "ash", label: "Ясень" },
      ]}
    >
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Материал" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Хвойные</SelectLabel>
          <SelectItem value="larch">Ель</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Лиственные</SelectLabel>
          <SelectItem value="oak">Дуб</SelectItem>
          <SelectItem value="ash">Ясень</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select items={materialOptions}>
      <SelectTrigger size="sm" className="w-48">
        <SelectValue placeholder="Материал" />
      </SelectTrigger>
      <SelectContent>
        {materialOptions.map((material) => (
          <SelectItem key={material.value} value={material.value}>
            {material.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select items={materialOptions} disabled defaultValue="Дуб">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Материал" />
      </SelectTrigger>
      <SelectContent>
        {materialOptions.map((material) => (
          <SelectItem key={material.value} value={material.value}>
            {material.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Select items={materialOptions}>
      <SelectTrigger className="w-48" aria-invalid>
        <SelectValue placeholder="Материал" />
      </SelectTrigger>
      <SelectContent>
        {materialOptions.map((material) => (
          <SelectItem key={material.value} value={material.value}>
            {material.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const WithErrorMessage: Story = {
  render: () => (
    <Field data-invalid className="w-48">
      <Select items={materialOptions}>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Материал" />
        </SelectTrigger>
        <SelectContent>
          {materialOptions.map((material) => (
            <SelectItem key={material.value} value={material.value}>
              {material.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError>Выберите материал.</FieldError>
    </Field>
  ),
};
