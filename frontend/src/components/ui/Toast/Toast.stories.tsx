import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@ui/base/button";
import Toaster, { toastError, toastSuccess } from "@ui/Toast";

const meta = {
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToastDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Toaster />
      <div className="flex gap-2">
        <Button
          onClick={() => toastSuccess("Saved", "Your changes were stored.")}
        >
          Success toast
        </Button>
        <Button
          variant="destructive"
          onClick={() => toastError("Failed", "Something went wrong.")}
        >
          Error toast
        </Button>
        <Button onClick={() => toastSuccess("Saved without description")}>
          Title only
        </Button>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ToastDemo />,
};
