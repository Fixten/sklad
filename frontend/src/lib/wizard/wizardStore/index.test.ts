import { describe, expect, it, vi } from "vitest";

import { createWizardStore } from ".";

import type { WizardConfig } from ".";

type Step = "pick" | "details";

interface Shared {
  label: string;
}

const config: WizardConfig<Step, Shared> = {
  initialStep: "pick",
  initialShared: { label: "test" },
  getBackStep: (step) => (step === "pick" ? null : "pick"),
  failureMessage: "Не удалось сохранить",
};

const gate = () => {
  let open!: () => void;
  const promise = new Promise<void>((resolve) => {
    open = resolve;
  });

  return { promise, open };
};

describe("createWizardStore", () => {
  it("starts from the configured state", () => {
    const store = createWizardStore(config);

    expect(store.getSnapshot()).toEqual({
      step: "pick",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("starts from the shared data of the mount", () => {
    const store = createWizardStore(config, { label: "other" });

    expect(store.getSnapshot().shared).toEqual({ label: "other" });
  });

  it("runs an advancing task and moves to the next step", async () => {
    const store = createWizardStore(config);
    const deferred = gate();
    const pending = store.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );

    expect(store.getSnapshot().requestId).not.toBeNull();

    deferred.open();
    await pending;

    expect(store.getSnapshot()).toEqual({
      step: "details",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("reports a failed task and keeps the step", async () => {
    const store = createWizardStore(config);

    await store.advance(
      () => Promise.reject(new Error("Недостаточно прав")),
      () => "details",
    );

    expect(store.getSnapshot()).toEqual({
      step: "pick",
      shared: { label: "test" },
      requestId: null,
      error: "Недостаточно прав",
    });
  });

  it("falls back to the configured failure message", async () => {
    const store = createWizardStore(config);
    const failure = { reason: "boom" } as unknown as Error;

    await store.advance(
      () => Promise.reject(failure),
      () => "details",
    );

    expect(store.getSnapshot().error).toBe("Не удалось сохранить");
  });

  it("clears the previous failure when a new task starts", async () => {
    const store = createWizardStore(config);
    const deferred = gate();

    await store.advance(
      () => Promise.reject(new Error("Ошибка")),
      () => "details",
    );

    const pending = store.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );

    expect(store.getSnapshot().error).toBeNull();

    deferred.open();
    await pending;
  });

  it("does not start a second task while one runs", async () => {
    const store = createWizardStore(config);
    const deferred = gate();
    let calls = 0;
    const first = store.advance(
      async () => {
        calls += 1;
        await deferred.promise;

        return "done";
      },
      () => "details",
    );

    await store.advance(
      () => {
        calls += 1;

        return Promise.resolve("done");
      },
      () => "details",
    );

    expect(calls).toBe(1);

    deferred.open();
    await first;
  });

  it("ignores navigation and close while a task runs", async () => {
    const store = createWizardStore(config);
    const deferred = gate();
    const pending = store.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );

    store.go("details");
    store.back();

    expect(store.getSnapshot().step).toBe("pick");
    expect(store.close()).toBe(false);
    expect(store.getSnapshot().step).toBe("pick");

    deferred.open();
    await pending;
  });

  it("updates shared data while a task runs", async () => {
    const store = createWizardStore(config);
    const deferred = gate();
    const pending = store.advance(
      async () => {
        await deferred.promise;

        return "done";
      },
      () => "details",
    );

    store.setShared({ label: "next" });

    expect(store.getSnapshot().shared).toEqual({ label: "next" });
    expect(store.getSnapshot().requestId).not.toBeNull();

    deferred.open();
    await pending;
    expect(store.getSnapshot().shared).toEqual({ label: "next" });
  });

  it("closes an idle session back to the mount data", () => {
    const store = createWizardStore(config);

    store.go("details");
    store.setShared({ label: "next" });

    expect(store.close()).toBe(true);
    expect(store.getSnapshot()).toEqual({
      step: "pick",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("completes a task by resetting and reporting the close", async () => {
    const store = createWizardStore(config);
    store.go("details");

    const closed = await store.complete(() => Promise.resolve("done"));

    expect(closed).toBe(true);
    expect(store.getSnapshot()).toEqual({
      step: "pick",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("keeps the session open when completion fails", async () => {
    const store = createWizardStore(config);
    store.go("details");

    const closed = await store.complete(() =>
      Promise.reject(new Error("Ошибка")),
    );

    expect(closed).toBe(false);
    expect(store.getSnapshot().step).toBe("details");
    expect(store.getSnapshot().error).toBe("Ошибка");
  });

  it("goes back to the configured step", () => {
    const store = createWizardStore(config);

    store.go("details");
    store.back();

    expect(store.getSnapshot().step).toBe("pick");
  });

  it("notifies subscribers until they unsubscribe", () => {
    const store = createWizardStore(config);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    store.go("details");

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.go("pick");

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
