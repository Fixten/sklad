import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router";
import { screen, userEvent } from "storybook/test";

import AppLayout from "@/layout/App.layout";

import { stubSupplyPageApi } from "./testFixtures";

import SupplyPage from "./index";

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
