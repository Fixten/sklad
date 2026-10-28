import { fn, screen, userEvent } from "storybook/test";
import zod from "zod";

import { Button } from "@ui/Button";
import { FormInputField } from "@ui/InputField";

import { Form, useZodForm } from "./index";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FieldValues, UseFormReturn } from "react-hook-form";

const validator = zod.object({
  name: zod.string().trim().min(2, "At least 2 characters"),
});

interface FormExampleProps {
  defaultName?: string;
}

function FormExample({ defaultName = "" }: FormExampleProps) {
  const form = useZodForm({
    schema: validator,
    defaultValues: { name: defaultName },
  });

  return (
    <Form form={form} onSubmit={fn()}>
      <FormInputField
        control={form.control}
        name="name"
        label="Name"
        placeholder="Skład"
        hint="At least 2 characters"
      />
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </Form>
  );
}

const meta = {
  component: Form,
  args: {
    form: {} as UseFormReturn<FieldValues, unknown, unknown>,
    onSubmit: fn(),
  },
  argTypes: {
    form: { control: false },
    onSubmit: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FormExample />,
};

export const WithValue: Story = {
  render: () => <FormExample defaultName="Skład" />,
};

export const WithValidationError: Story = {
  render: () => <FormExample defaultName="S" />,
  play: async () => {
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
  },
};
