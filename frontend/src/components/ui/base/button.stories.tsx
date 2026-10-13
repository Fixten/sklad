import { ArrowDownToLineIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Button } from "./button";

import type { Meta, StoryObj } from "@storybook/react-vite";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const sizes = [
  "default",
  "xs",
  "sm",
  "lg",
  "icon",
  "icon-xs",
  "icon-sm",
  "icon-lg",
] as const;

const meta = {
  component: Button,
  args: { children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Icons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
      <Button {...args}>
        Download
        <ArrowDownToLineIcon data-icon="inline-end" />
      </Button>
      <Button {...args} size="icon" aria-label="Settings">
        <SettingsIcon />
      </Button>
      <Button {...args} size="icon-sm" aria-label="Settings">
        <SettingsIcon />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
