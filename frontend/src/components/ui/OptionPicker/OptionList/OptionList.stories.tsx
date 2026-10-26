import { useState } from "react";
import { fn } from "storybook/test";

import { PlusIcon } from "@ui/Icon";

import OptionList from "./index";

import type { OptionItem } from "./index";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

const suppliers: OptionItem[] = [
  { key: "1", label: "Столярный двор" },
  { key: "2", label: "Лесная биржа" },
  { key: "3", label: "Дуб и Ко" },
];

const materialVariants: OptionItem[] = [
  { key: "create", label: "Новый материал: «Клён»", icon: <PlusIcon /> },
  { key: "1", label: "Дуб · 20 мм", meta: "Пиломатериалы" },
  { key: "2", label: "Ясень · 30 мм", meta: "Пиломатериалы" },
  { key: "3", label: "Берёза · 40 мм", meta: "Пиломатериалы" },
];

const ControlledList = (props: ComponentProps<typeof OptionList>) => {
  const [activeKey, setActiveKey] = useState(props.activeKey);

  return (
    <OptionList
      {...props}
      activeKey={activeKey}
      onActivate={setActiveKey}
      onSelect={setActiveKey}
    />
  );
};

const meta = {
  component: OptionList,
  args: {
    id: "materials",
    ariaLabel: "Варианты",
    options: materialVariants,
    activeKey: "1",
    onActivate: fn(),
    onSelect: fn(),
  },
  decorators: [(Story) => <div className="w-80 p-6">{Story()}</div>],
} satisfies Meta<typeof OptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { options: suppliers, activeKey: "1" },
};

export const Controlled: Story = {
  render: (args) => <ControlledList {...args} />,
};
