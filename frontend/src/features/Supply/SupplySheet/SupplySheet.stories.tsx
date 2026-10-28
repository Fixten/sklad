import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fn, screen, userEvent } from "storybook/test";

import SupplySheetHarness from "./SupplySheetHarness";
import { stubSupplyApi } from "./testFixtures";

import SupplySheet from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const searchMaterial = async (query: string) => {
  await userEvent.type(await screen.findByLabelText("Материал"), query);
};

const openDetails = async () => {
  await searchMaterial("Дуб");
  await userEvent.click(
    await screen.findByRole("option", { name: /Доска 40 мм/ }),
  );
};

const fillDetails = async () => {
  await userEvent.type(screen.getByLabelText("Количество"), "8");
  await userEvent.type(screen.getByLabelText("Цена закупки, всего"), "24000");
  await userEvent.type(screen.getByLabelText("Поставщик"), "Столярный двор");
  await userEvent.click(
    await screen.findByRole("option", { name: /Столярный двор/ }),
  );
};

const meta = {
  component: SupplySheet,
  args: {
    open: true,
    onOpenChange: fn(),
  },
  render: (args) => (
    <SupplySheetHarness
      initialOpen={args.open}
      onOpenChange={args.onOpenChange}
    />
  ),
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  beforeEach: () => stubSupplyApi(),
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SupplySheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Pick: Story = {};

export const Variant: Story = {
  play: async () => {
    await searchMaterial("Дуб");
    await userEvent.click(await screen.findByText("Новый вариант в «Дуб»"));
  },
};

export const Material: Story = {
  play: async () => {
    await searchMaterial("Ясень");
    await userEvent.click(await screen.findByText("Новый материал: «Ясень»"));
  },
};

export const Details: Story = {
  play: async () => {
    await openDetails();
    await fillDetails();
  },
};
