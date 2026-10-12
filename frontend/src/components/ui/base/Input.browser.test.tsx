import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Field, FieldLabel } from "./field";
import { Input } from "./input";

test("exposes a labelled textbox", async () => {
  const screen = await render(
    <Field>
      <FieldLabel htmlFor="name">Name</FieldLabel>
      <Input id="name" />
    </Field>,
  );

  await expect
    .element(screen.getByRole("textbox"))
    .toMatchAriaInlineSnapshot(`- textbox "Name"`);
});
