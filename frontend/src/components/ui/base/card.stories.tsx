import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
        <CardFooter>
          <p>Card footer</p>
        </CardFooter>
      </>
    ),
  },
};

export const WithAction: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
        <CardFooter>
          <p>Card footer</p>
        </CardFooter>
      </>
    ),
  },
};

export const Simple: Story = {
  args: {
    children: (
      <CardContent>
        <p>Simple card with just content.</p>
      </CardContent>
    ),
  },
};
