import { MemoryRouter, Route, Routes } from "react-router";
import { userEvent, within } from "storybook/test";

import AppLayout from "@/layout/App.layout";

import MaterialPage from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: MaterialPage,
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
} satisfies Meta<typeof MaterialPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActionsOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByPlaceholderText("Поиск действий"));
  },
};
