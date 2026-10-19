import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import Typography from "./index";

const variants = [
  "display",
  "title",
  "label",
  "body",
  "caption",
  "data",
] as const;

test.each(variants)("renders the %s variant", async (variant) => {
  const screen = await render(
    <Typography variant={variant} data-testid="typography">
      1 248,50 Ölçü
    </Typography>,
  );

  await expect(screen.getByTestId("typography")).toMatchScreenshot();
});
