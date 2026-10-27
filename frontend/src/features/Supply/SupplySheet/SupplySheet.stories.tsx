import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fn, screen, userEvent } from "storybook/test";

import { createApiStub } from "@/test/apiStub";

import SupplySheetHarness from "./SupplySheetHarness";
import { supplySheetRoutes } from "./testFixtures";

import SupplySheet from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const mockApi = () => {
  const originalFetch = window.fetch.bind(window);
  const { fetch } = createApiStub(supplySheetRoutes());
  window.fetch = fetch;

  return () => {
    window.fetch = originalFetch;
  };
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const meta = {
  component: SupplySheet,
  args: {
    open: true,
    onOpenChange: fn(),
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  beforeEach: mockApi,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SupplySheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SupplySheetHarness
      initialOpen={args.open}
      onOpenChange={args.onOpenChange}
    />
  ),
};

export const Details: Story = {
  render: (args) => (
    <SupplySheetHarness
      initialOpen={args.open}
      onOpenChange={args.onOpenChange}
    />
  ),
  play: async () => {
    await userEvent.click(
      await screen.findByRole("option", { name: /Доска 40 мм/ }),
    );
  },
};
