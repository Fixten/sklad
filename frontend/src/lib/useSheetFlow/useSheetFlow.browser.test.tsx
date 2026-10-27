import { expect, test } from "vitest";
import { renderHook } from "vitest-browser-react";

import { useSheetFlow } from "./useSheetFlow";

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

test("go() moves to step and clears failure", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.fail("Ошибка");
  });
  expect(screen.result.current.failure).toBe("Ошибка");

  await screen.act(() => {
    screen.result.current.go("details");
  });

  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.failure).toBeNull();
});

test("fail() sets failure message without changing step", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.fail("Ошибка");
  });

  expect(screen.result.current.failure).toBe("Ошибка");
  expect(screen.result.current.step).toBe("pick");
});

test("clearFailure() removes failure", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.fail("Ошибка");
  });
  expect(screen.result.current.failure).toBe("Ошибка");

  await screen.act(() => {
    screen.result.current.clearFailure();
  });

  expect(screen.result.current.failure).toBeNull();
});

test("reset() returns to initial step and clears state", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.go("details");
    screen.result.current.fail("Ошибка");
  });
  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.failure).toBe("Ошибка");

  await screen.act(() => {
    screen.result.current.reset();
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.failure).toBeNull();
  expect(screen.result.current.busy).toBe(false);
});

test("run() ignores concurrent calls while busy", async () => {
  const screen = await mount();
  const deferred1 = gate();
  let calls = 0;
  let pending1: Promise<void> | undefined;

  await screen.act(() => {
    pending1 = screen.result.current.run(async () => {
      calls++;
      await deferred1.promise;
      return "details";
    });
  });

  await screen.act(() => {
    void screen.result.current.run(() => {
      calls++;
      return Promise.resolve<Step>("details");
    });
  });

  expect(calls).toBe(1);

  deferred1.open();
  await screen.act(async () => {
    await pending1;
  });

  expect(screen.result.current.step).toBe("details");
});

test("run() does not go when task returns null", async () => {
  const screen = await mount();

  await screen.act(async () => {
    await screen.result.current.run(() => Promise.resolve(null));
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.busy).toBe(false);
});

test("run() does not go when task returns undefined", async () => {
  const screen = await mount();

  await screen.act(async () => {
    await screen.result.current.run(() => Promise.resolve(undefined));
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.busy).toBe(false);
});

test("run() sets failure when task throws", async () => {
  const screen = await mount();

  await screen.act(async () => {
    await screen.result.current.run(() =>
      Promise.reject(new Error("Сеть недоступна")),
    );
  });

  expect(screen.result.current.failure).toBe("Сеть недоступна");
  expect(screen.result.current.busy).toBe(false);
  expect(screen.result.current.step).toBe("pick");
});

test("run() clears failure at start", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.fail("Старая ошибка");
  });
  expect(screen.result.current.failure).toBe("Старая ошибка");

  await screen.act(async () => {
    await screen.result.current.run(() => Promise.resolve("details"));
  });

  expect(screen.result.current.failure).toBeNull();
  expect(screen.result.current.step).toBe("details");
});

test("ignores error when task throws after reset", async () => {
  const screen = await mount();
  const deferred = gate();
  let pending: Promise<void> | undefined;

  await screen.act(() => {
    pending = screen.result.current.run(async () => {
      await deferred.promise;
      throw new Error("Ошибка");
    });
  });

  await screen.act(() => {
    screen.result.current.reset();
  });

  deferred.open();

  await screen.act(async () => {
    await pending;
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.failure).toBeNull();
});
