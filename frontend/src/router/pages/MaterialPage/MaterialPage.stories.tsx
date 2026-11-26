import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { screen, userEvent } from "storybook/test";

import AppLayout from "@/layout/App.layout";

import { catalogFixtures, stubCatalogApi } from "./catalogFixtures";
import MaterialCardPage from "./MaterialCardPage";

import MaterialPage from "./index";

const openMaterial = async () => {
  await userEvent.click(screen.getByRole("link", { name: "Доска сосна" }));
};

const meta = {
  component: MaterialPage,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={["/materials"]}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/materials" element={<Story />} />
                <Route
                  path="/materials/material/:id"
                  element={<MaterialCardPage />}
                />
              </Route>
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      );
    },
  ],
  beforeEach: () => stubCatalogApi(catalogFixtures),
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MaterialPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CardPage: Story = {
  play: openMaterial,
};

export const EditForm: Story = {
  play: async () => {
    await openMaterial();
    await userEvent.click(
      screen.getByRole("button", { name: "Редактировать" }),
    );
  },
};

export const HiddenList: Story = {
  play: async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "Показать скрытые" }),
    );
  },
};

export const ActionsOpen: Story = {
  play: async () => {
    await userEvent.click(screen.getByPlaceholderText("Начать работу"));
  },
};
