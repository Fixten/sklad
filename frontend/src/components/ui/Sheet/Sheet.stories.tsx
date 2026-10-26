import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@ui/Button";
import { InputField } from "@ui/InputField";
import SelectField from "@ui/SelectField";
import Typography from "@ui/Typography";

import Sheet from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SelectFieldOption } from "@ui/SelectField";
import type { ComponentProps } from "react";

type SheetConfig = Omit<ComponentProps<typeof Sheet>, "open" | "onOpenChange">;

const ControlledSheet = (props: SheetConfig) => {
  const [open, setOpen] = useState(true);

  return <Sheet {...props} open={open} onOpenChange={setOpen} />;
};

const unitOptions: SelectFieldOption[] = [
  { value: "m3", label: "м³" },
  { value: "pcs", label: "шт." },
  { value: "kg", label: "кг" },
];

const meta = {
  component: Sheet,
  args: {
    open: true,
    onOpenChange: fn(),
    title: "Поставка материала",
    step: "01 / 02",
    actions: null,
    children: null,
  },
  argTypes: {
    open: { control: false },
    onOpenChange: { control: false },
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ControlledSheet
      title="Поставка материала"
      step="01 / 02"
      actions={
        <>
          <Button variant="outline">Отмена</Button>
          <Button>Сохранить поставку</Button>
        </>
      }
    >
      <Typography variant="body">
        Выберите материал из списка или создайте новый.
      </Typography>
    </ControlledSheet>
  ),
};

export const WithHint: Story = {
  render: () => (
    <ControlledSheet
      title="Поставка материала"
      step="01 / 02"
      hint={
        <Typography variant="label">
          Можно ввести поиск по названию, типу и варианту.
        </Typography>
      }
      actions={
        <>
          <Button variant="outline">Отмена</Button>
          <Button>Сохранить поставку</Button>
        </>
      }
    >
      <Typography variant="body">
        Введите часть названия, типа или варианта материала.
      </Typography>
    </ControlledSheet>
  ),
};

export const WithHintAndError: Story = {
  render: () => (
    <ControlledSheet
      title="Поставка материала"
      step="01 / 02"
      hint={
        <Typography variant="label" className="text-muted-foreground m-0">
          ↑↓ Выбрать · Enter
        </Typography>
      }
      error="Не удалось сохранить поставку. Проверьте соединение и попробуйте ещё раз."
      actions={
        <>
          <Button variant="outline">Отмена</Button>
          <Button>Сохранить поставку</Button>
        </>
      }
    >
      <Typography variant="body">
        Выберите материал из списка или создайте новый.
      </Typography>
    </ControlledSheet>
  ),
};

export const WithBack: Story = {
  render: () => (
    <ControlledSheet
      title="Поставка материала"
      step="02 / 02"
      back={<Button variant="ghost">Назад</Button>}
      hint={
        <Typography
          variant="label"
          className="text-muted-foreground m-0 shrink-0"
        >
          03.12.2026
        </Typography>
      }
      actions={
        <>
          <Button variant="outline">Отмена</Button>
          <Button>Сохранить поставку</Button>
        </>
      }
    >
      <Typography variant="body">
        Укажите количество, цену и поставщика партии.
      </Typography>
    </ControlledSheet>
  ),
};

export const Form: Story = {
  render: () => (
    <ControlledSheet
      title="Поставка материала"
      step="01 / 02"
      actions={
        <>
          <Button variant="outline">Отмена</Button>
          <Button>Создать и продолжить</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Материал" placeholder="Дуб" />
        <SelectField
          label="Единица"
          options={unitOptions}
          value="m3"
          onValueChange={fn()}
        />
      </div>
    </ControlledSheet>
  ),
};
export const LongContent: Story = {
  render: () => (
    <ControlledSheet
      title="Поставка материала"
      step="01 / 02"
      actions={
        <>
          <Button variant="outline">Отмена</Button>
          <Button>Сохранить поставку</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {Array.from({ length: 20 }, (_, index) => (
          <Typography variant="body" key={index}>
            Пункт {index + 1} длинного содержимого листа для проверки прокрутки.
          </Typography>
        ))}
      </div>
    </ControlledSheet>
  ),
};
