import { describe, expect, it } from "vitest";

import { createWizardMachine } from ".";

import type { WizardEvent, WizardState } from ".";

type Step = "pick" | "details";

interface Shared {
  label: string;
}

const machine = createWizardMachine<Step, Shared>({
  initialStep: "pick",
  initialShared: { label: "test" },
  getBackStep: (step) => (step === "pick" ? null : "pick"),
});

const reduce = (
  state: WizardState<Step, Shared>,
  ...events: WizardEvent<Step, Shared>[]
) => events.reduce((current, event) => machine.reduce(current, event), state);

describe("createWizardMachine", () => {
  it("starts with the configured step, shared data and no request", () => {
    expect(machine.initial).toEqual({
      step: "pick",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("navigates and clears the failure", () => {
    const failed = { ...machine.initial, error: "Ошибка" };

    expect(reduce(failed, { type: "navigate", step: "details" })).toEqual({
      step: "details",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("ignores navigation while a request is running", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 1 });

    expect(reduce(busy, { type: "navigate", step: "details" })).toBe(busy);
  });

  it("updates shared data from the previous value", () => {
    const next = reduce(machine.initial, {
      type: "setShared",
      update: (previous) => ({ label: `${previous.label}!` }),
    });

    expect(next.shared).toEqual({ label: "test!" });
  });

  it("updates shared data while a request is running", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 1 });
    const next = reduce(busy, {
      type: "setShared",
      update: () => ({ label: "next" }),
    });

    expect(next.shared).toEqual({ label: "next" });
    expect(next.requestId).toBe(1);
  });

  it("admits one request and clears the failure", () => {
    const failed = { ...machine.initial, error: "Ошибка" };
    const began = reduce(failed, { type: "begin", requestId: 1 });

    expect(began.requestId).toBe(1);
    expect(began.error).toBeNull();
    expect(reduce(began, { type: "begin", requestId: 2 })).toBe(began);
  });

  it("applies a successful request with a matching id", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 1 });

    expect(
      reduce(busy, { type: "succeed", requestId: 1, step: "details" }),
    ).toEqual({
      step: "details",
      shared: { label: "test" },
      requestId: null,
      error: null,
    });
  });

  it("ignores a successful request with a stale id", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 2 });

    expect(
      reduce(busy, { type: "succeed", requestId: 1, step: "details" }),
    ).toBe(busy);
  });

  it("finishes a matching request by resetting the session", () => {
    const busy = reduce(
      machine.initial,
      { type: "navigate", step: "details" },
      { type: "begin", requestId: 1 },
    );

    expect(reduce(busy, { type: "finish", requestId: 1 })).toBe(
      machine.initial,
    );
  });

  it("ignores a finish with a stale id", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 2 });

    expect(reduce(busy, { type: "finish", requestId: 1 })).toBe(busy);
  });

  it("reports a failure with a matching id", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 1 });

    expect(
      reduce(busy, { type: "fail", requestId: 1, message: "Ошибка" }),
    ).toEqual({
      step: "pick",
      shared: { label: "test" },
      requestId: null,
      error: "Ошибка",
    });
  });

  it("ignores a failure with a stale id", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 2 });

    expect(
      reduce(busy, { type: "fail", requestId: 1, message: "Ошибка" }),
    ).toBe(busy);
  });

  it("resets an idle session", () => {
    const moved = reduce(machine.initial, {
      type: "navigate",
      step: "details",
    });

    expect(reduce(moved, { type: "reset" })).toBe(machine.initial);
  });

  it("ignores reset while a request is running", () => {
    const busy = reduce(machine.initial, { type: "begin", requestId: 1 });

    expect(reduce(busy, { type: "reset" })).toBe(busy);
  });

  it("reports the configured back target", () => {
    expect(machine.backStep(machine.initial)).toBeNull();
    expect(machine.backStep({ ...machine.initial, step: "details" })).toBe(
      "pick",
    );
  });
});
