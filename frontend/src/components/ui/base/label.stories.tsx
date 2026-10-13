import { Input } from "./input";
import { Label } from "./label";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Label,
  args: { children: "Email" },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} htmlFor="label-email">
        Email
      </Label>
      <Input id="label-email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label {...args} htmlFor="label-disabled">
        Email
      </Label>
      <Input
        id="label-disabled"
        type="email"
        placeholder="you@example.com"
        disabled
      />
    </div>
  ),
};
