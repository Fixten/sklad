import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import MaterialPage from "./index";

test("renders the collapsed action search line", async () => {
  const screen = await render(<MaterialPage />);

  await expect
    .element(screen.getByPlaceholder("Поиск действий"))
    .toBeInTheDocument();
  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
  await expect
    .element(screen.getByText("Пока нет действий"))
    .not.toBeInTheDocument();
});

test("opens the empty action panel on click", async () => {
  const screen = await render(<MaterialPage />);

  await screen.getByPlaceholder("Поиск действий").click();

  await expect.element(screen.getByRole("listbox")).toBeInTheDocument();
  await expect
    .element(screen.getByText("Пока нет действий"))
    .toBeInTheDocument();
});
