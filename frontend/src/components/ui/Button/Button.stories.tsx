import { Button } from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Button,
  args: {
    children: "Создать и продолжить",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Submit: Story = {
  args: { type: "submit" },
};

export const Pending: Story = {
  args: {
    type: "submit",
    pending: true,
    pendingLabel: "Создаём…",
  },
};
