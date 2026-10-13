import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field";
import { Input } from "./input";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

const orientations = ["vertical", "horizontal", "responsive"] as const;

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="field-default">Email</FieldLabel>
      <Input id="field-default" type="email" placeholder="you@example.com" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </Field>
  ),
};

export const Orientations: Story = {
  render: () => (
    <FieldGroup className="w-96">
      {orientations.map((orientation) => (
        <Field key={orientation} orientation={orientation}>
          <FieldLabel htmlFor={`field-${orientation}`}>
            {orientation}
          </FieldLabel>
          <Input id={`field-${orientation}`} placeholder="Value" />
        </Field>
      ))}
    </FieldGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="field-error">Email</FieldLabel>
      <Input
        id="field-error"
        type="email"
        placeholder="you@example.com"
        aria-invalid
      />
      <FieldError>This field is required.</FieldError>
    </Field>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="field-name">Name</FieldLabel>
        <Input id="field-name" placeholder="John Doe" />
      </Field>
      <FieldSeparator />
      <Field>
        <FieldLabel htmlFor="field-separator-email">Email</FieldLabel>
        <Input
          id="field-separator-email"
          type="email"
          placeholder="you@example.com"
        />
      </Field>
    </div>
  ),
};

export const FieldSetStory: Story = {
  name: "FieldSet",
  render: () => (
    <FieldSet className="w-96">
      <FieldLegend>Account</FieldLegend>
      <Field>
        <FieldLabel htmlFor="field-set-name">Name</FieldLabel>
        <Input id="field-set-name" placeholder="John Doe" />
      </Field>
      <Field>
        <FieldLabel htmlFor="field-set-email">Email</FieldLabel>
        <Input
          id="field-set-email"
          type="email"
          placeholder="you@example.com"
        />
        <FieldDescription>We'll never share your email.</FieldDescription>
      </Field>
    </FieldSet>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field data-disabled>
      <FieldLabel htmlFor="field-disabled">Email</FieldLabel>
      <Input
        id="field-disabled"
        type="email"
        placeholder="you@example.com"
        disabled
      />
      <FieldDescription>Editing is disabled.</FieldDescription>
    </Field>
  ),
};
