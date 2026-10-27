import { describe, expect, it } from "vitest";

import {
  createFlowState,
  flowFailureMessage,
  flowReducer,
} from "./useSheetFlow";

import type { FlowState } from "./useSheetFlow";

type Step = "pick" | "details";

const initial = createFlowState<Step>("pick");

describe("flowReducer", () => {
  it("moves to the next step and clears the previous failure", () => {
    const state: FlowState<Step> = { ...initial, failure: "Ошибка" };

    expect(flowReducer(state, { type: "go", step: "details" })).toEqual({
      step: "details",
      failure: null,
      busy: false,
    });
  });

  it("shows a failure without losing the current step", () => {
    const state: FlowState<Step> = { ...initial, step: "details" };

    expect(flowReducer(state, { type: "fail", message: "Ошибка" })).toEqual({
      step: "details",
      failure: "Ошибка",
      busy: false,
    });
  });

  it("tracks pending work", () => {
    expect(flowReducer(initial, { type: "busy", value: true }).busy).toBe(true);
    expect(
      flowReducer({ ...initial, busy: true }, { type: "busy", value: false })
        .busy,
    ).toBe(false);
  });

  it("returns to the reset step and forgets the session", () => {
    const state: FlowState<Step> = {
      step: "details",
      failure: "Ошибка",
      busy: true,
    };

    expect(flowReducer(state, { type: "reset", step: "pick" })).toEqual(
      createFlowState("pick"),
    );
  });

  it("keeps the state reference when nothing changes", () => {
    expect(flowReducer(initial, { type: "clearFailure" })).toBe(initial);
    expect(flowReducer(initial, { type: "busy", value: false })).toBe(initial);
  });
});

describe("flowFailureMessage", () => {
  it("uses the error message", () => {
    expect(flowFailureMessage(new Error("Недостаточно прав"))).toBe(
      "Недостаточно прав",
    );
  });

  it("falls back for unknown errors", () => {
    expect(flowFailureMessage("boom")).toBe("Не удалось сохранить");
    expect(flowFailureMessage("boom", "Не удалось создать")).toBe(
      "Не удалось создать",
    );
  });
});
