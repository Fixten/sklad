import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen, userEvent } from "storybook/test";

import {
  stubEmptySupplyPageApi,
  stubPendingSupplyPageApi,
  stubSupplyPageApi,
} from "@/features/Supply/testFixtures";

import SupplyCreate from ".";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: 0 } },
});

const selectDoska = async () => {
  await userEvent.type(await screen.findByLabelText("Поиск"), "Дуб");
  await userEvent.click(
    await screen.findByRole("option", { name: /Доска 40 мм/ }),
  );
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

export const ManualDraft: Story = {
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Тип"), "Ясень");
    await userEvent.type(screen.getByLabelText("Материал"), "Ясень 40");
    await userEvent.type(screen.getByLabelText("Вариант"), "Доска 40 мм");
    await userEvent.click(screen.getByRole("combobox", { name: "Единица" }));
    await userEvent.click(await screen.findByRole("option", { name: "штука" }));
  },
};

export const Loading: Story = {
  beforeEach: () => stubPendingSupplyPageApi(),
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Поиск"), "Дуб");
  },
};

export const Search: Story = {
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Поиск"), "Дуб");
  },
};

export const Selected: Story = {
  play: async () => {
    await selectDoska();
  },
};

export const Validation: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Сохранить" }));
  },
};

export const NoResults: Story = {
  play: async () => {
    await userEvent.type(await screen.findByLabelText("Поиск"), "Клён");
  },
};

export const Empty: Story = {
  beforeEach: () => stubEmptySupplyPageApi(),
};
