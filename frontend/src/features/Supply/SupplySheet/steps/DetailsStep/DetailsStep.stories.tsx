import { screen, userEvent } from "storybook/test";

import SupplyStepHarness from "../../SupplyStepHarness";
import { dubRow, stubSupplyApi } from "../../testFixtures";

import DetailsStep from ".";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: DetailsStep,
  args: {
    row: dubRow,
  },
  render: (args) => (
    <SupplyStepHarness>
      <DetailsStep {...args} />
    </SupplyStepHarness>
  ),
  beforeEach: () => stubSupplyApi(),
} satisfies Meta<typeof DetailsStep>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  play: async () => {
    await userEvent.type(screen.getByLabelText("Количество"), "8");
    await userEvent.type(screen.getByLabelText("Цена закупки, всего"), "24000");
    await userEvent.type(screen.getByLabelText("Поставщик"), "Столярный двор");
    await userEvent.click(
      await screen.findByRole("option", { name: /Столярный двор/ }),
    );
  },
};
