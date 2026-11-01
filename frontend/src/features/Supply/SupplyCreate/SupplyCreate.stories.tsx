import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen, userEvent } from "storybook/test";

import {
  stubPendingSupplyPageApi,
  stubSupplyPageApi,
} from "@/features/Supply/testFixtures";

import SupplyCreate from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const selectDoska = async () => {
  await userEvent.type(await screen.findByLabelText("Материал"), "Дуб");
  await userEvent.click(
    await screen.findByRole("option", { name: /Доска 40 мм/ }),
  );
};

const fillDetails = async () => {
  await selectDoska();
  await userEvent.type(screen.getByLabelText("Количество"), "8");
  await userEvent.type(screen.getByLabelText("Цена закупки, всего"), "24000");
  await userEvent.type(screen.getByLabelText("Поставщик"), "Столярный двор");
};

const meta = {
  component: SupplyCreate,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="mx-auto w-full max-w-2xl p-6">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  beforeEach: () => stubSupplyPageApi(),
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SupplyCreate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  beforeEach: () => stubPendingSupplyPageApi(),
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Материал"), "Дуб");
  },
};

export const Search: Story = {
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Материал"), "Дуб");
  },
};

export const Selected: Story = {
  play: async () => {
    await selectDoska();
  },
};

export const Filled: Story = {
  play: async () => {
    await fillDetails();
  },
};

export const Validation: Story = {
  play: async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "Записать поставку" }),
    );
  },
};

export const NoResults: Story = {
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Материал"), "Клён");
  },
};
