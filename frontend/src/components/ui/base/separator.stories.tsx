import { Separator } from "./separator";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>Above</div>
      <Separator />
      <div>Below</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <div>Left</div>
      <Separator orientation="vertical" />
      <div>Right</div>
    </div>
  ),
};
