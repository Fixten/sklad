import { expect, test } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useSheetFlow } from "./sheetFlow";

type Step = "pick" | "details";

const gate = () => {
  let open!: () => void;
  const promise = new Promise<void>((resolve) => {
    open = resolve;
  });

  return { promise, open };
};

const mount = () => renderHook(() => useSheetFlow<Step>("pick"));

test("moves when the task settles while the flow is current", async () => {
  const screen = await mount();

  await screen.act(async () => {
    await screen.result.current.run(() => Promise.resolve<Step>("details"));
  });

  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.busy).toBe(false);
});

test("ignores a task that settles after a reset", async () => {
  const screen = await mount();
  const deferred = gate();
  let pending: Promise<void> | undefined;

  await screen.act(() => {
    pending = screen.result.current.run(async () => {
      await deferred.promise;
      return "details";
    });
  });

  expect(screen.result.current.busy).toBe(true);

  await screen.act(() => {
    screen.result.current.reset();
  });

  expect(screen.result.current.busy).toBe(false);

  deferred.open();

  await screen.act(async () => {
    await pending;
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.failure).toBeNull();
});

test("tells a stale task it is no longer current", async () => {
  const screen = await mount();
  const deferred = gate();
  let currentAtSettle: boolean | null = null;
  let pending: Promise<void> | undefined;

  await screen.act(() => {
    pending = screen.result.current.run(async (isCurrent) => {
      await deferred.promise;
      currentAtSettle = isCurrent();
      return "details";
    });
  });

  await screen.act(() => {
    screen.result.current.reset();
  });

  deferred.open();

  await screen.act(async () => {
    await pending;
  });

  expect(currentAtSettle).toBe(false);
  expect(screen.result.current.step).toBe("pick");
});
