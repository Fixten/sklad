import { useState } from "react";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledDialog() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open Controlled Dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled Dialog</DialogTitle>
            <DialogDescription>
              This dialog is controlled with state.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a dialog description.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledDialog />,
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button />}>Open Scrollable Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Dialog</DialogTitle>
          <DialogDescription>
            Long content scrolls inside the dialog body.
          </DialogDescription>
        </DialogHeader>
        <div className="flex max-h-64 flex-col gap-4 overflow-y-auto py-4">
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index}>Paragraph {index + 1} of the dialog content.</p>
          ))}
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  ),
};
