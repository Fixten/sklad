import { FieldGroup } from "@ui/InputFieldGroup";

import { InputField } from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: InputField,
  args: { label: "Материал", placeholder: "Например: Дуб" },
  decorators: [(Story) => <div className="w-80 p-6">{Story()}</div>],
} satisfies Meta<typeof InputField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "Дуб" },
};

export const WithHint: Story = {
  args: { hint: "Например: Дуб, ясень, берёза" },
};

export const WithUnit: Story = {
  args: { label: "Количество", unit: "кг", placeholder: "0,00" },
};

export const Loading: Story = {
  args: { label: "Load", loading: true, loadingLabel: "load" },
};

export const UnitAndLoading: Story = {
  args: {
    ...WithUnit.args,
    ...Loading.args,
  },
};

export const Numeric: Story = {
  args: {
    label: "Цена закупки",
    unit: "₽",
    type: "number",
    min: 0,
    step: 0.01,
    hint: "За единицу измерения",
  },
};

export const Invalid: Story = {
  args: {
    label: "Количество",
    unit: "кг",
    defaultValue: "0",
    error: "Укажите количество — от 0,01",
  },
};

export const InvalidWithHint: Story = {
  args: {
    hint: "Например: Дуб, ясень, берёза",
    error: "Укажите материал или создайте новый",
  },
};

export const Disabled: Story = {
  args: { defaultValue: "Дуб", disabled: true },
};

export const ReadOnly: Story = {
  args: { label: "Единица измерения", defaultValue: "Метры", readOnly: true },
};

export const Form: Story = {
  render: (args) => (
    <FieldGroup>
      <InputField {...args} />
      <InputField
        label="Количество"
        unit="кг"
        type="number"
        min={0}
        step={0.01}
        defaultValue="12.5"
      />
      <InputField
        label="Цена закупки"
        unit="₽"
        type="number"
        min={0}
        step={0.01}
        error="Укажите цену — от 0,01"
      />
      <InputField label="Поставщик" required hint="Кто привёз партию" />
    </FieldGroup>
  ),
};
