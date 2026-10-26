import { useReducer, useRef } from "react";

export interface FlowState<Step> {
  step: Step;
  failure: string | null;
  busy: boolean;
}

export type FlowAction<Step> =
  | { type: "go"; step: Step }
  | { type: "fail"; message: string }
  | { type: "clearFailure" }
  | { type: "busy"; value: boolean }
  | { type: "reset"; step: Step };

export const createFlowState = <Step>(step: Step): FlowState<Step> => ({
  step,
  failure: null,
  busy: false,
});

export function flowReducer<Step>(
  state: FlowState<Step>,
  action: FlowAction<Step>,
): FlowState<Step> {
  switch (action.type) {
    case "go":
      return { step: action.step, failure: null, busy: state.busy };
    case "fail":
      return { ...state, failure: action.message };
    case "clearFailure":
      return state.failure === null ? state : { ...state, failure: null };
    case "busy":
      return state.busy === action.value
        ? state
        : { ...state, busy: action.value };
    case "reset":
      return createFlowState(action.step);
  }
}

export type FlowTask<Step> = (
  isCurrent: () => boolean,
) => Promise<Step | null | undefined>;

export const flowFailureMessage = (
  error: unknown,
  fallback = "Не удалось сохранить",
) => (error instanceof Error ? error.message : fallback);

export function useSheetFlow<Step>(initialStep: Step) {
  const [state, dispatch] = useReducer(
    flowReducer<Step>,
    initialStep,
    createFlowState,
  );
  const inFlight = useRef(false);
  const generation = useRef(0);

  const go = (step: Step) => {
    generation.current += 1;
    inFlight.current = false;
    dispatch({ type: "go", step });
  };

  const fail = (message: string) => {
    dispatch({ type: "fail", message });
  };

  const clearFailure = () => {
    dispatch({ type: "clearFailure" });
  };

  const reset = () => {
    generation.current += 1;
    inFlight.current = false;
    dispatch({ type: "reset", step: initialStep });
  };

  const run = async (task: FlowTask<Step>) => {
    if (inFlight.current) return;

    const current = generation.current;
    const isCurrent = () => current === generation.current;

    inFlight.current = true;
    dispatch({ type: "busy", value: true });
    dispatch({ type: "clearFailure" });

    try {
      const next = await task(isCurrent);

      if (!isCurrent()) return;

      if (next) dispatch({ type: "go", step: next });
    } catch (error) {
      if (!isCurrent()) return;

      dispatch({ type: "fail", message: flowFailureMessage(error) });
    } finally {
      if (isCurrent()) {
        inFlight.current = false;
        dispatch({ type: "busy", value: false });
      }
    }
  };

  return { ...state, go, fail, clearFailure, reset, run };
}
