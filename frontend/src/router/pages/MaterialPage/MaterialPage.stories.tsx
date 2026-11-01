import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { screen, userEvent } from "storybook/test";

import AppLayout from "@/layout/App.layout";
import SupplyPageComponent from "@/router/pages/SupplyPage";
import { stubSupplyPageApi } from "@/router/pages/SupplyPage/testFixtures";

import MaterialPage from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const openPalette = async () => {
  await userEvent.click(screen.getByPlaceholderText("Начать работу"));
};

const openSupply = async () => {
  await openPalette();
  await userEvent.click(screen.getByText("Сделать поставку"));
  await screen.findByRole("heading", { name: "Поставка" });
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
              <Route
                path="/material/supply"
                element={<SupplyPageComponent />}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  beforeEach: () => stubSupplyPageApi(),
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

export const SupplyPage: Story = {
  play: async () => {
    await openSupply();
  },
};
