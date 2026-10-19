import { fn } from "storybook/test";

import CommandPalette from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: CommandPalette,
  args: {
    heading: "Меню",
    items: [
      { key: "/", label: "Главная", onSelect: fn() },
      { key: "/settings", label: "Настройки", onSelect: fn() },
      { key: "/material", label: "Материалы", onSelect: fn() },
    ],
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
