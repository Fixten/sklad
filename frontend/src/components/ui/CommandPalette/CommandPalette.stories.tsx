import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn, userEvent, within } from "storybook/test";

import CommandPalette from "./index";

const meta = {
  component: CommandPalette,
  args: {
    heading: "Меню",
    items: [
      { value: "/", label: "Главная", onSelect: fn() },
      { value: "/settings", label: "Настройки", onSelect: fn() },
      { value: "/material", label: "Материалы", onSelect: fn() },
    ],
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByPlaceholderText("Начать работу"));
  },
};
