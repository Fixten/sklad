import { fn } from "storybook/test";

import { Button } from "@ui/Button";
import { InputField } from "@ui/InputField";
import SelectField from "@ui/SelectField";
import Typography from "@ui/Typography";

import Panel from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Panel,
  args: {
    label: "Новый материал",
    children: (
      <Typography variant="body">
        Панель группирует связанные поля и действия в одном блоке.
      </Typography>
    ),
  },
  decorators: [(Story) => <div className="w-96 p-6">{Story()}</div>],
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNote: Story = {
  args: {
    label: "Новый вариант",
    note: "Дуб · м³",
  },
};

export const WithForm: Story = {
  render: () => (
    <Panel label="Новый вариант" note="Дуб · м³">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Вариант" placeholder="Дуб" />
        <SelectField
          label="Единица"
          options={[
            { value: "m3", label: "м³" },
            { value: "pcs", label: "шт." },
          ]}
          value="m3"
          onValueChange={fn()}
        />
        <Button className="col-span-2 justify-self-end">
          Создать и продолжить
        </Button>
      </div>
    </Panel>
  ),
};
