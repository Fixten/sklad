import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { createWizard } from ".";

type Step = "pick" | "details";

const stepWizard = createWizard<Step, { label: string }>({
  initialStep: "pick",
  initialShared: { label: "test" },
  getBackStep: (step) => (step === "pick" ? null : "pick"),
  failureMessage: "Не удалось сохранить",
});

const useWizard = stepWizard.useWizard;
const WizardProvider = stepWizard.Provider;

interface MountOptions {
  initialShared?: { label: string };
  onClose?: () => void;
}

const mount = ({ initialShared, onClose = vi.fn() }: MountOptions = {}) =>
  renderHook(() => useWizard(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <WizardProvider initialShared={initialShared} onClose={onClose}>
        {children}
      </WizardProvider>
    ),
  });

const gate = () => {
  let open!: () => void;
  const promise = new Promise<void>((resolve) => {
    open = resolve;
  });

  return { promise, open };
};

test("exposes the current step, shared data and back availability", async () => {
  const screen = await mount();

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.shared).toEqual({ label: "test" });
  expect(screen.result.current.canGoBack).toBe(false);
  expect(screen.result.current.pending).toBe(false);
  expect(screen.result.current.error).toBeNull();
});

test("starts from the shared data of the mount", async () => {
  const screen = await mount({ initialShared: { label: "other" } });

  expect(screen.result.current.shared).toEqual({ label: "other" });
});

test("re-renders after navigation and shared updates", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.go("details");
    screen.result.current.setShared({ label: "next" });
  });

  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.shared).toEqual({ label: "next" });
  expect(screen.result.current.canGoBack).toBe(true);
});

test("closing resets the session and notifies the host", async () => {
  const onClose = vi.fn();
  const screen = await mount({ onClose });

  await screen.act(() => {
    screen.result.current.go("details");
    screen.result.current.setShared({ label: "next" });
  });

  await screen.act(() => {
    screen.result.current.close();
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.shared).toEqual({ label: "test" });
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("an advanced task moves to the next step and clears pending", async () => {
  const screen = await mount();
  const deferred = gate();
  let pending!: Promise<void>;

  await screen.act(() => {
    pending = screen.result.current.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );
  });

  expect(screen.result.current.pending).toBe(true);

  deferred.open();

  await screen.act(async () => {
    await pending;
  });

  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.pending).toBe(false);
  expect(screen.result.current.error).toBeNull();
});

test("a failed task keeps the step and reports the message", async () => {
  const screen = await mount();

  await screen.act(async () => {
    await screen.result.current.advance(
      () => Promise.reject(new Error("Недостаточно прав")),
      () => "details",
    );
  });

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.error).toBe("Недостаточно прав");
  expect(screen.result.current.pending).toBe(false);
});

test("close and back are ignored while a task runs", async () => {
  const onClose = vi.fn();
  const screen = await mount({ onClose });
  const deferred = gate();
  let pending!: Promise<void>;

  await screen.act(() => {
    screen.result.current.go("details");
  });

  await screen.act(() => {
    pending = screen.result.current.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );
  });

  await screen.act(() => {
    screen.result.current.back();
    screen.result.current.close();
  });

  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.pending).toBe(true);
  expect(onClose).not.toHaveBeenCalled();

  deferred.open();

  await screen.act(async () => {
    await pending;
  });
});

test("a completed task closes the session", async () => {
  const onClose = vi.fn();
  const screen = await mount({ onClose });

  await screen.act(async () => {
    await screen.result.current.complete(() => Promise.resolve("done"));
  });

  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.result.current.step).toBe("pick");
});

test("a failed completion keeps the session open", async () => {
  const onClose = vi.fn();
  const screen = await mount({ onClose });

  await screen.act(async () => {
    await screen.result.current.complete(() =>
      Promise.reject(new Error("Ошибка")),
    );
  });

  expect(onClose).not.toHaveBeenCalled();
  expect(screen.result.current.error).toBe("Ошибка");
});

test("settles a pending task after the provider unmounts", async () => {
  const screen = await mount();
  const deferred = gate();
  let pending!: Promise<void>;

  await screen.act(() => {
    pending = screen.result.current.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );
  });

  await screen.unmount();
  deferred.open();

  await expect(pending).resolves.toBeUndefined();
});
