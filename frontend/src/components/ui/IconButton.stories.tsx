import { PlusIcon, SettingsIcon } from "lucide-react";
import { fn } from "storybook/test";

import IconButton from "./IconButton";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: IconButton,
  args: {
    children: <SettingsIcon />,
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Icons: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} aria-label="Add">
        <PlusIcon />
      </IconButton>
      <IconButton {...args} aria-label="Settings">
        <SettingsIcon />
      </IconButton>
    </div>
  ),
};
