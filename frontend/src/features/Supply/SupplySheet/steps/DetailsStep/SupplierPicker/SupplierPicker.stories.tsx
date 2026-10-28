import { useState } from "react";
import { fn, screen, userEvent } from "storybook/test";

import { fullSuppliers } from "../../../testFixtures";

import SupplierPicker from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

const ControlledSupplierPicker = (
  props: ComponentProps<typeof SupplierPicker>,
) => {
  const [value, setValue] = useState(props.value);

  return <SupplierPicker {...props} value={value} onChange={setValue} />;
};

const openList = async () => {
  await userEvent.click(screen.getByLabelText("Поставщик"));
};

const meta = {
  component: SupplierPicker,
  args: {
    suppliers: fullSuppliers,
    value: { id: null, name: "" },
    onChange: fn(),
  },
  render: (args) => <ControlledSupplierPicker {...args} />,
  decorators: [
    (Story) => (
      <div className="bg-popover w-full max-w-[560px] p-6">{Story()}</div>
    ),
  ],
} satisfies Meta<typeof SupplierPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: openList,
};

export const Matched: Story = {
  args: {
    value: { id: null, name: "Лес" },
  },
  play: openList,
};

export const Selected: Story = {
  args: {
    value: { id: 5, name: "Столярный двор" },
  },
  play: openList,
};

export const WithError: Story = {
  args: {
    error: "Укажите поставщика",
  },
  play: openList,
};
