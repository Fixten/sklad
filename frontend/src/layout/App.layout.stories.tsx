import { MemoryRouter, Route, Routes } from "react-router";

import Typography from "@ui/Typography";

import AppLayout from "./App.layout";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: AppLayout,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Story />}>
            <Route
              index
              element={
                <Typography tagName="p" variant="body">
                  Содержимое страницы
                </Typography>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
