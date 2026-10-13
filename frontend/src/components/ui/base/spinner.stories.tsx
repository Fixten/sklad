import { Spinner } from "./spinner";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithText: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Spinner />
      <span>Loading...</span>
    </div>
  ),
};
