import { fn } from "storybook/test";

import { Input } from "./input";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Input,
  args: { placeholder: "Type something..." },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
};

export const WithValue: Story = {
  args: {
    value: "Hello world",
    onChange: fn(),
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Not an email",
  },
};

export const File: Story = {
  args: {
    type: "file",
  },
};
