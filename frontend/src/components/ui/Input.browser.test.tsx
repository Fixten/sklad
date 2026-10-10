import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import Input from "./Input";

test("exposes a labelled textbox", async () => {
  const screen = await render(<Input label="Name" />);

  await expect
    .element(screen.getByRole("textbox"))
    .toMatchAriaInlineSnapshot(`- textbox "Name"`);
});
