import { useState } from "react";
import { fn } from "storybook/test";

import SelectField from "./index";

import type { SelectFieldOption } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

const unitOptions: SelectFieldOption[] = [
  { value: "m3", label: "м³" },
  { value: "pcs", label: "шт." },
  { value: "kg", label: "кг" },
];

const ControlledSelect = (props: ComponentProps<typeof SelectField>) => {
  const [value, setValue] = useState(props.value);

  return <SelectField {...props} value={value} onValueChange={setValue} />;
};

const meta = {
  component: SelectField,
  args: {
    label: "Единица измерения",
    options: unitOptions,
    value: "m3",
    onValueChange: fn(),
  },
  decorators: [(Story) => <div className="w-80 p-6">{Story()}</div>],
} satisfies Meta<typeof SelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: { error: "Выберите единицу измерения" },
};

export const Controlled: Story = {
  render: (args) => <ControlledSelect {...args} />,
};
