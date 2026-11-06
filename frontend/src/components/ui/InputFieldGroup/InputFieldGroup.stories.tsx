import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputField } from "@ui/InputField";

import InputFieldGroup from ".";

const meta = {
  component: InputFieldGroup,
  args: {
    label: "Партия",
    children: (
      <>
        <InputField label="Количество" unit="м" />
        <InputField label="Цена закупки, всего" unit="₽" />
      </>
    ),
  },
  decorators: [(Story) => <div className="w-96 p-6">{Story()}</div>],
} satisfies Meta<typeof InputFieldGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: "Количество и цена за партию.",
  },
};
