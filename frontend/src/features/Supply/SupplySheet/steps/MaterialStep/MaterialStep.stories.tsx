import { screen, userEvent } from "storybook/test";

import SupplyStepHarness from "../../SupplyStepHarness";
import { stubSupplyApi } from "../../testFixtures";

import MaterialStep from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: MaterialStep,
  render: () => (
    <SupplyStepHarness initialQuery="Ясень">
      <MaterialStep />
    </SupplyStepHarness>
  ),
  beforeEach: () => stubSupplyApi(),
} satisfies Meta<typeof MaterialStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NewType: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole("combobox", { name: "Тип" }));
    await userEvent.click(
      await screen.findByRole("option", { name: "+ Новый тип" }),
    );
  },
};
