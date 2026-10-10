import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import Button from "./Button";

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

test.each(variants)("renders the %s variant", async (variant) => {
  const screen = await render(<Button variant={variant}>{variant}</Button>);

  await expect(
    screen.getByRole("button", { name: variant }),
  ).toMatchScreenshot();
});
