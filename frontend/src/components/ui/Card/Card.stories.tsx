import type { Meta, StoryObj } from "@storybook/react-vite";

import Typography from "@ui/Typography";

import Card from "./index";

const meta = {
  component: Card,
  args: { title: "Доска сосна" },
  decorators: [(Story) => <div className="w-96 p-6">{Story()}</div>],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "Сорт первый" },
};

export const WithChildren: Story = {
  args: {
    description: "Сорт первый",
    children: (
      <Typography variant="caption" className="text-muted-foreground">
        Древесина
      </Typography>
    ),
  },
};
