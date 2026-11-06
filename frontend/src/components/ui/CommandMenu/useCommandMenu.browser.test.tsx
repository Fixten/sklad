import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { useCommandMenu } from "./useCommandMenu";

interface HostProps {
  onClose?: () => void;
}

function Host(props: HostProps) {
  const { open, openList, handleKeyDown, wrapperRef } = useCommandMenu({
    closeOnOutside: "click",
    onClose: props.onClose,
  });

  return (
    <div onKeyDown={handleKeyDown} ref={wrapperRef}>
      <input
        data-testid="menu-input"
        onClick={openList}
        onFocus={openList}
        readOnly
      />
      {open ? <div data-testid="menu-list" /> : null}
    </div>
  );
}

test("opens from the input", async () => {
  const screen = await render(<Host />);

  await userEvent.click(screen.getByTestId("menu-input"));

  await expect.element(screen.getByTestId("menu-list")).toBeInTheDocument();
});

test("closes on escape while open and stops propagation", async () => {
  const parent = vi.fn();
  const screen = await render(
    <div onKeyDown={parent}>
      <Host />
    </div>,
  );

  await userEvent.click(screen.getByTestId("menu-input"));
  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByTestId("menu-list")).not.toBeInTheDocument();
  expect(parent).not.toHaveBeenCalled();
});

test("leaves escape to parents when closed", async () => {
  const parent = vi.fn<(event: { defaultPrevented: boolean }) => void>();
  const screen = await render(
    <div onKeyDown={parent}>
      <Host />
    </div>,
  );

  await userEvent.click(screen.getByTestId("menu-input"));
  await userEvent.keyboard("{Escape}{Escape}");

  expect(parent).toHaveBeenCalledOnce();
  expect(parent.mock.calls[0]?.[0].defaultPrevented).toBe(false);
});

test("closes on an outside click and runs onClose", async () => {
  const onClose = vi.fn();
  const screen = await render(
    <>
      <Host onClose={onClose} />
      <button type="button">Снаружи</button>
    </>,
  );

  await userEvent.click(screen.getByTestId("menu-input"));
  await userEvent.click(screen.getByRole("button", { name: "Снаружи" }));

  await expect.element(screen.getByTestId("menu-list")).not.toBeInTheDocument();
  expect(onClose).toHaveBeenCalledTimes(1);
});
