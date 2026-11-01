import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { screen, userEvent } from "storybook/test";

import AppLayout from "@/layout/App.layout";

import MaterialPage from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const openPalette = async () => {
  await userEvent.click(screen.getByPlaceholderText("Начать работу"));
};

const meta = {
  component: MaterialPage,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/material"]}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/material" element={<Story />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
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
  play: async () => {
    await openPalette();
  },
};
