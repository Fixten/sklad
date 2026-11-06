import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Textarea } from "./textarea";

const meta = {
  component: Textarea,
  args: { placeholder: "Type your message..." },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea",
  },
};

export const WithValue: Story = {
  args: {
    value: "Hello\nworld",
    onChange: fn(),
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Message too long",
  },
};

export const Rows: Story = {
  args: {
    rows: 6,
    placeholder: "Six rows tall...",
  },
};
