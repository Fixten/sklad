import Typography from "./Typography";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Typography,
  args: {
    children: "Складской учёт",
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Typography {...args} variant="display">
        Display — раздел
      </Typography>
      <Typography {...args} variant="title">
        Title — карточка
      </Typography>
      <Typography {...args} variant="label">
        Label — подпись поля
      </Typography>
      <Typography {...args} variant="body">
        Body — основной текст
      </Typography>
      <Typography {...args} variant="caption">
        Caption — пояснение
      </Typography>
      <Typography {...args} variant="data">
        Data — 1 248,50 ₽
      </Typography>
    </div>
  ),
};

export const TagName: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Typography {...args} variant="title" tagName="span">
        Title as span — no heading semantics
      </Typography>
      <Typography {...args} variant="label" tagName="a" href="/material">
        Label as anchor
      </Typography>
      <Typography {...args} variant="body" tagName="div">
        Body as div
      </Typography>
    </div>
  ),
};
