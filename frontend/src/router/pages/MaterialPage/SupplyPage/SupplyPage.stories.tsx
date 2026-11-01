import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";

import { stubSupplyPageApi } from "@/features/Supply/testFixtures";
import AppLayout from "@/layout/App.layout";

import SupplyPage from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const meta = {
  title: "router/pages/MaterialPage/SupplyPage",
  component: SupplyPage,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/material/supply"]}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/material" element={<div>Материалы</div>} />
              <Route path="/material/supply" element={<Story />} />
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
} satisfies Meta<typeof SupplyPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
