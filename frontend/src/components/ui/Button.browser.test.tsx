import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import Button from "./Button";

test("renders its label and fires onClick", async () => {
  const onClick = vi.fn();
  const screen = await render(<Button onClick={onClick}>Save</Button>);

  const button = screen.getByRole("button", { name: "Save" });
  await expect.element(button).toBeInTheDocument();

  await button.click();
  expect(onClick).toHaveBeenCalledOnce();
});

test("reflects the disabled state", async () => {
  const screen = await render(<Button disabled>Save</Button>);

  await expect
    .element(screen.getByRole("button", { name: "Save" }))
    .toBeDisabled();
});
