import { expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

import { createWizard } from "./createWizard";

import type { ReactNode } from "react";

type Step = "pick" | "details";

const stepWizard = createWizard<Step, { label: string }>({
  initialStep: "pick",
  getBackStep: (step) => (step === "pick" ? null : "pick"),
});

const useWizard = stepWizard.useWizard;
const WizardProvider = stepWizard.Provider;

interface MountOptions {
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
}

const mount = ({
  onClose = vi.fn(),
  onOpenChange = vi.fn(),
}: MountOptions = {}) =>
  renderHook(() => useWizard(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <WizardProvider
        open
        onOpenChange={onOpenChange}
        shared={{ label: "test" }}
        onClose={onClose}
      >
        {children}
      </WizardProvider>
    ),
  });

test("exposes the current step and shared state", async () => {
  const screen = await mount();

  expect(screen.result.current.step).toBe("pick");
  expect(screen.result.current.shared).toEqual({ label: "test" });
});

test("goes back to the configured step and does nothing without a target", async () => {
  const screen = await mount();

  await screen.act(() => {
    screen.result.current.back();
  });

  expect(screen.result.current.step).toBe("pick");

  await screen.act(() => {
    screen.result.current.go("details");
  });

  expect(screen.result.current.step).toBe("details");

  await screen.act(() => {
    screen.result.current.back();
  });

  expect(screen.result.current.step).toBe("pick");
});

test("closing resets the flow and notifies the owner", async () => {
  const onClose = vi.fn();
  const onOpenChange = vi.fn();
  const screen = await mount({ onClose, onOpenChange });

  await screen.act(() => {
    screen.result.current.go("details");
    screen.result.current.handleOpenChange(false);
  });

  expect(screen.result.current.step).toBe("pick");
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

test("opening does not reset the flow", async () => {
  const onClose = vi.fn();
  const onOpenChange = vi.fn();
  const screen = await mount({ onClose, onOpenChange });

  await screen.act(() => {
    screen.result.current.go("details");
    screen.result.current.handleOpenChange(true);
  });

  expect(screen.result.current.step).toBe("details");
  expect(onClose).not.toHaveBeenCalled();
  expect(onOpenChange).toHaveBeenCalledWith(true);
});

test("submits through the latest registered handler", async () => {
  const screen = await mount();
  const first = vi.fn();
  const second = vi.fn();

  await screen.act(() => {
    screen.result.current.registerSubmit(first);
  });

  await screen.act(() => {
    screen.result.current.submit();
  });

  expect(first).toHaveBeenCalledTimes(1);

  await screen.act(() => {
    screen.result.current.registerSubmit(second);
  });

  await screen.act(() => {
    screen.result.current.submit();
  });

  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(1);

  await screen.act(() => {
    screen.result.current.registerSubmit(undefined);
  });

  await screen.act(() => {
    screen.result.current.submit();
  });

  expect(second).toHaveBeenCalledTimes(1);
});

test("runs async transitions and reports failures", async () => {
  const screen = await mount();

  await screen.act(async () => {
    await screen.result.current.run(() => Promise.resolve("details"));
  });

  expect(screen.result.current.step).toBe("details");

  await screen.act(async () => {
    await screen.result.current.run(() =>
      Promise.reject(new Error("Не удалось сохранить")),
    );
  });

  expect(screen.result.current.step).toBe("details");
  expect(screen.result.current.failure).toBe("Не удалось сохранить");
  expect(screen.result.current.busy).toBe(false);
});
