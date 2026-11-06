import type { Meta, StoryObj } from "@storybook/react-vite";

import SupplyStepHarness from "../../SupplyStepHarness";
import { dubMaterial, stubSupplyApi } from "../../testFixtures";

import VariantStep from ".";

const meta = {
  component: VariantStep,
  args: {
    material: dubMaterial,
  },
  render: (args) => (
    <SupplyStepHarness>
      <VariantStep {...args} />
    </SupplyStepHarness>
  ),
  beforeEach: () => stubSupplyApi(),
} satisfies Meta<typeof VariantStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
