import { MemoryRouter } from "react-router";

import Header from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const navItems = [
  { link: "/", name: "Home" },
  { link: "/settings", name: "Settings" },
  { link: "/material", name: "Material" },
];

const meta = {
  component: Header,
  args: {
    className: "",
    navItems,
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
