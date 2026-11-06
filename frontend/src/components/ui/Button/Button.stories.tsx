import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from ".";

const meta = {
  component: Button,
  args: {
    children: "Создать и продолжить",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    type: "submit",
    pending: true,
    pendingLabel: "Создаём…",
  },
};
