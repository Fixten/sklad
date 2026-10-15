import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { fn } from "storybook/test";
import zod from "zod";

import { Button } from "@base/button";
import { Field, FieldError, FieldLabel } from "@base/field";
import { Input } from "@base/input";

import { Form } from "./form";

import type { Meta, StoryObj } from "@storybook/react-vite";
import type { UseFormReturn } from "react-hook-form";

const validator = zod.object({
  name: zod.string().min(2, "At least 2 characters"),
});

type Schema = zod.infer<typeof validator>;

interface FormExampleProps {
  defaultName?: string;
}

function FormExample({ defaultName = "" }: FormExampleProps) {
  const form = useForm<Schema>({
    resolver: zodResolver(validator),
    defaultValues: { name: defaultName },
  });

  const { errors } = form.formState;

  return (
    <Form form={form} onSubmit={fn()}>
      <Field data-invalid={errors.name ? true : undefined}>
        <FieldLabel htmlFor="form-name">Name</FieldLabel>
        <Input
          id="form-name"
          aria-invalid={errors.name ? true : undefined}
          {...form.register("name")}
        />
        <FieldError errors={errors.name ? [errors.name] : undefined} />
      </Field>
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </Form>
  );
}

const meta = {
  component: Form,
  args: {
    form: {} as UseFormReturn,
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
