import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { InputField } from "@ui/InputField";

import InputFieldGroup from ".";

test("renders a labelled group with its fields", async () => {
  const screen = await render(
    <InputFieldGroup label="Партия" description="Количество и цена.">
      <InputField label="Количество" />
    </InputFieldGroup>,
  );

  await expect
    .element(screen.getByRole("group", { name: "Партия" }))
    .toBeInTheDocument();
  await expect
    .element(screen.getByText("Количество и цена."))
    .toBeInTheDocument();
  await expect.element(screen.getByLabelText("Количество")).toBeInTheDocument();
});
