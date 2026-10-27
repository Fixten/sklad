import { useRef, useState } from "react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { useOutsidePress } from "./useOutsidePress";

function Harness({ closeOn }: { closeOn: "pointerdown" | "click" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useOutsidePress({
    ref,
    active,
    closeOn,
    onOutside: () => {
      setActive(false);
    },
  });

  return (
    <>
      <div ref={ref} data-testid="inside">
        <button type="button">Внутри</button>
      </div>
      <button
        type="button"
        onClick={() => {
          setActive(true);
        }}
      >
        Открыть
      </button>
      <button type="button">Снаружи</button>
      <span data-testid="state">{active ? "open" : "closed"}</span>
    </>
  );
}

test.each(["pointerdown", "click"] as const)(
  "closes on an outside press (%s)",
  async (closeOn) => {
    const screen = await render(<Harness closeOn={closeOn} />);

    await userEvent.click(screen.getByRole("button", { name: "Открыть" }));
    await expect.element(screen.getByTestId("state")).toHaveTextContent("open");

    await userEvent.click(screen.getByRole("button", { name: "Снаружи" }));

    await expect
      .element(screen.getByTestId("state"))
      .toHaveTextContent("closed");
  },
);

test("stays open on an inside press", async () => {
  const screen = await render(<Harness closeOn="click" />);

  await userEvent.click(screen.getByRole("button", { name: "Открыть" }));
  await userEvent.click(screen.getByRole("button", { name: "Внутри" }));

  await expect.element(screen.getByTestId("state")).toHaveTextContent("open");
});

test("ignores a press that started before it opened", async () => {
  const screen = await render(<Harness closeOn="click" />);
  const outside = screen.getByRole("button", { name: "Снаружи" }).element();

  outside.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

  await userEvent.click(screen.getByRole("button", { name: "Открыть" }));

  outside.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  await expect.element(screen.getByTestId("state")).toHaveTextContent("open");
});
