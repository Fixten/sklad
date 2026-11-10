import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentType } from "react";
import { fn } from "storybook/test";

import OptionPicker from "./index";
import type { OptionPickerProps } from "./index";

const Preview: ComponentType<OptionPickerProps> = OptionPicker;

const meta = {
  component: Preview,
  args: {
    label: "Материал",
    onSelect: fn(),
    options: [
      {
        value: "1",
        label: "Доска 40 мм",
      },
      {
        value: "2",
        label: "Брусок 60 × 60",
      },
    ],
  },
  decorators: [(Story) => <div className="w-80 p-6">{Story()}</div>],
} satisfies Meta<typeof Preview>;

export default meta;

type Story = StoryObj<OptionPickerProps>;

function StatefulPicker(props: OptionPickerProps) {
  const [value, setValue] = useState<OptionPickerProps["value"]>(props.value);

  return (
    <OptionPicker
      {...props}
      value={value}
      onSelect={(nextValue) => {
        setValue(nextValue);
        props.onSelect(nextValue);
      }}
    />
  );
}

export const Default: Story = {
  render: (args) => <StatefulPicker {...args} />,
};

export const WithError: Story = {
  ...Default,
  args: {
    error: "Error",
  },
};

export const WithPlaceholder: Story = {
  ...Default,
  args: {
    placeholder: "placeholder",
  },
};

export const WithLoader: Story = {
  ...Default,
  args: {
    loading: true,
    options: [],
  },
};

export const CreateOnly: Story = {
  ...Default,
  args: {
    canCreate: true,
  },
};
