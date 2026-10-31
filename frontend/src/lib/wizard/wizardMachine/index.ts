export interface WizardState<Step, Shared> {
  readonly step: Step;
  readonly shared: Shared;
  readonly requestId: number | null;
  readonly error: string | null;
}

export interface WizardMachineConfig<Step, Shared> {
  readonly initialStep: Step;
  readonly initialShared: Shared;
  readonly getBackStep?: (step: Step) => Step | null;
}

export type WizardEvent<Step, Shared> =
  | { readonly type: "navigate"; readonly step: Step }
  | {
      readonly type: "setShared";
      readonly update: (previous: Shared) => Shared;
    }
  | { readonly type: "begin"; readonly requestId: number }
  | {
      readonly type: "succeed";
      readonly requestId: number;
      readonly step: Step;
    }
  | { readonly type: "finish"; readonly requestId: number }
  | {
      readonly type: "fail";
      readonly requestId: number;
      readonly message: string;
    }
  | { readonly type: "reset" };

export interface WizardMachine<Step, Shared> {
  readonly initial: WizardState<Step, Shared>;
  reduce(
    state: WizardState<Step, Shared>,
    event: WizardEvent<Step, Shared>,
  ): WizardState<Step, Shared>;
  backStep(state: WizardState<Step, Shared>): Step | null;
}

export function createWizardMachine<Step, Shared>(
  config: WizardMachineConfig<Step, Shared>,
): WizardMachine<Step, Shared> {
  const initial: WizardState<Step, Shared> = {
    step: config.initialStep,
    shared: config.initialShared,
    requestId: null,
    error: null,
  };

  const reduce = (
    state: WizardState<Step, Shared>,
    event: WizardEvent<Step, Shared>,
  ): WizardState<Step, Shared> => {
    switch (event.type) {
      case "navigate":
        return state.requestId === null
          ? { ...state, step: event.step, error: null }
          : state;

      case "setShared":
        return { ...state, shared: event.update(state.shared) };

      case "begin":
        return state.requestId === null
          ? { ...state, requestId: event.requestId, error: null }
          : state;

      case "succeed":
        return state.requestId === event.requestId
          ? {
              step: event.step,
              shared: state.shared,
              requestId: null,
              error: null,
            }
          : state;

      case "finish":
        return state.requestId === event.requestId ? initial : state;

      case "fail":
        return state.requestId === event.requestId
          ? { ...state, requestId: null, error: event.message }
          : state;

      case "reset":
        return state.requestId === null ? initial : state;
    }
  };

  const backStep = (state: WizardState<Step, Shared>) =>
    config.getBackStep?.(state.step) ?? null;

  return { initial, reduce, backStep };
}
