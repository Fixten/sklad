import { MemoryRouter, Route, Routes } from "react-router";

import AppLayout from "@/layout/App.layout";

import Home from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Home,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Story />} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
