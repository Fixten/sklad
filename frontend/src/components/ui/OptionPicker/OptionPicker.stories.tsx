import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { ComponentType } from "react";
import { fn } from "storybook/test";

import OptionPicker from "./index";
import type { OptionPickerProps } from "./index";

const Preview: ComponentType<OptionPickerProps<string>> = OptionPicker;

const Controlled = (props: OptionPickerProps<string>) => {
  const [query, setQuery] = useState(props.query);

  return <OptionPicker {...props} query={query} onQueryChange={setQuery} />;
};

const meta = {
  component: Preview,
  args: {
    id: "option-picker",
    label: "Материал",
    placeholder: "Название, тип или вариант",
    query: "Дуб",
    hint: "Поиск по названию, типу и варианту.",
    autoFocus: true,
    onSelect: fn(),
    onQueryChange: fn(),
    create: {
      createLabel: "Новый вариант в «Дуб»",
      onCreate: fn(),
    },
    options: [
      {
        value: "1",
        label: "Доска 40 мм",
        meta: "Пиломатериал · Дуб",
      },
      {
        value: "2",
        label: "Брусок 60 × 60",
        meta: "Пиломатериал · Дуб",
      },
    ],
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
  args: { options: [] },
  render: renderControlled,
};
