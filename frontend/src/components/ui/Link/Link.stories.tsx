import { MemoryRouter, Routes, Route } from "react-router";

import { Link, NavLink } from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const decorator = (Story: React.FC) => (
  <MemoryRouter initialEntries={["/"]}>
    <Routes>
      <Route path="*" element={<Story />} />
    </Routes>
  </MemoryRouter>
);

const meta: Meta<typeof Link> = {
  component: Link,
  args: {
    to: "/",
    children: "Home",
  },
  decorators: [decorator],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NavLinks: Story = {
  render: () => (
    <nav className="flex gap-8">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/settings">Settings</NavLink>
      <NavLink to="/material">Material</NavLink>
    </nav>
  ),
};
