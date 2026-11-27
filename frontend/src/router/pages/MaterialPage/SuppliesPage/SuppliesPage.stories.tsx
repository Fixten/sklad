import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";

import AppLayout from "@/layout/App.layout";
import pathsRouter from "@/router/paths.router";

import { stubSuppliesApi } from "./fixtures";

import SuppliesPage from ".";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const meta = {
  title: "router/pages/MaterialPage/SuppliesPage",
  component: SuppliesPage,
  decorators: [
    (Story, context) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[context.parameters.entry ?? pathsRouter.supplies]}
        >
          <Routes>
            <Route element={<AppLayout />}>
              <Route
                path={pathsRouter.material}
                element={<div>Материалы</div>}
              />
              <Route path={pathsRouter.supplies} element={<Story />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    ),
  ],
  beforeEach: () => stubSuppliesApi(),
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SuppliesPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {};

export const Variant: Story = {
  parameters: { entry: `${pathsRouter.supplies}?variant=100` },
};

export const Empty: Story = {
  beforeEach: () => stubSuppliesApi([]),
};
