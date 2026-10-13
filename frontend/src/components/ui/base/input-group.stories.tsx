import { SearchIcon } from "lucide-react";

import { Button } from "./button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
  InputGroupText,
} from "./input-group";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const addonAligns = [
  "inline-start",
  "inline-end",
  "block-start",
  "block-end",
] as const;

const buttonSizes = ["xs", "sm", "icon-xs", "icon-sm"] as const;

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Search</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Enter your email" />
      <InputGroupAddon align="inline-end">
        <Button variant="secondary">Subscribe</Button>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const AddonAlignments: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {addonAligns.map((align) => (
        <InputGroup key={align}>
          <InputGroupAddon align={align}>
            <InputGroupText>{align}</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="Input" />
        </InputGroup>
      ))}
    </div>
  ),
};

export const ButtonSizes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      {buttonSizes.map((size) => (
        <InputGroup key={size}>
          <InputGroupInput placeholder={size} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size={size}
              aria-label={size.startsWith("icon") ? size : undefined}
            >
              {size.startsWith("icon") ? <SearchIcon /> : size}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
};

export const Textarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea placeholder="Write a comment..." rows={3} />
      <InputGroupAddon align="block-end">
        <InputGroupText>Markdown is supported.</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputGroup data-disabled>
      <InputGroupInput placeholder="Disabled" disabled />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Invalid" aria-invalid />
      <InputGroupAddon align="inline-end">
        <InputGroupText>Error</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};
