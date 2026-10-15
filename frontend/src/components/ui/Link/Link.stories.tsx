import { MemoryRouter } from "react-router";

import Link from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Link,
  args: {
    to: "/",
    children: "Home",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NavLinks: Story = {
  render: () => (
    <nav className="flex gap-8">
      <Link to="/">Home</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/material">Material</Link>
    </nav>
  ),
};
