import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { SettingsIcon } from "@ui/Icon";

import IconButton from "./index";

test("forwards button props and keeps the outline icon style", async () => {
  const onClick = vi.fn();
  const screen = await render(
    <IconButton aria-label="Настройки" title="Настройки" onClick={onClick}>
      <SettingsIcon aria-hidden="true" />
    </IconButton>,
  );
  const button = screen.getByRole("button", { name: "Настройки" });

  const className = button.element().getAttribute("class") ?? "";
  await expect.element(button).toHaveAttribute("title", "Настройки");
  expect(className).toContain("border-input");
  expect(className).not.toContain("bg-destructive");
  await button.click();

  expect(onClick).toHaveBeenCalledOnce();
});

test("applies the requested variant", async () => {
  const screen = await render(
    <IconButton aria-label="Подтвердить" variant="destructive">
      <SettingsIcon aria-hidden="true" />
    </IconButton>,
  );
  const button = screen.getByRole("button", { name: "Подтвердить" });

  expect(button.element().getAttribute("class")).toContain("bg-destructive");
});

test("shows only the spinner while pending", async () => {
  const screen = await render(
    <IconButton aria-label="Восстановить" pending>
      <SettingsIcon data-testid="settings-icon" aria-hidden="true" />
    </IconButton>,
  );
  const button = screen.getByRole("button", { name: "Восстановить" });

  await expect.element(button).toHaveAttribute("aria-busy", "true");
  await expect.element(button).toBeEnabled();
  expect(screen.getByTestId("settings-icon").query()).toBeNull();
});
