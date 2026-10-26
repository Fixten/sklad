import { useState } from "react";
import { fn } from "storybook/test";

import OptionPicker from "./index";

import type { OptionPickerProps } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

const Preview: ComponentType<OptionPickerProps<string>> = OptionPicker;

const Controlled = (props: OptionPickerProps<string>) => {
  const [value, setValue] = useState(props.value);

  return <OptionPicker {...props} value={value} onValueChange={setValue} />;
};

const meta = {
  component: Preview,
  args: {
    id: "option-picker",
    label: "Материал",
    placeholder: "Название, тип или вариант",
    value: "Дуб",
    hint: "Поиск по названию, типу и варианту.",
    autoFocus: true,
    onSelect: fn(),
    onValueChange: fn(),
    onCreate: fn(),
    results: [
      {
        key: "1",
        value: "1",
        label: "Доска 40 мм",
        meta: "Пиломатериал · Дуб",
      },
      {
        key: "2",
        value: "2",
        label: "Брусок 60 × 60",
        meta: "Пиломатериал · Дуб",
      },
    ],
    createLabel: "Новый вариант в «Дуб»",
    listLabel: "Варианты",
  },
  decorators: [(Story) => <div className="w-80 p-6">{Story()}</div>],
} satisfies Meta<typeof Preview>;

export default meta;

type Story = StoryObj<OptionPickerProps<string>>;

const renderControlled = (args: OptionPickerProps<string>) => (
  <Controlled {...args} />
);

export const Open: Story = {
  render: renderControlled,
};

export const Idle: Story = {
  args: { autoFocus: false },
  render: renderControlled,
};

export const CreateOnly: Story = {
  args: { results: [] },
  render: renderControlled,
};
