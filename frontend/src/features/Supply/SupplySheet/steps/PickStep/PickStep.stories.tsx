import SupplyStepHarness from "../../SupplyStepHarness";
import { stubSupplyApi } from "../../testFixtures";

import PickStep from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: PickStep,
  beforeEach: () => stubSupplyApi(),
} satisfies Meta<typeof PickStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <SupplyStepHarness>
      <PickStep />
    </SupplyStepHarness>
  ),
};

export const Results: Story = {
  render: () => (
    <SupplyStepHarness initialQuery="Дуб">
      <PickStep />
    </SupplyStepHarness>
  ),
};
