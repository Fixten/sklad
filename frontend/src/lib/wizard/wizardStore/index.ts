import { errorMessage } from "../errorMessage";
import { createWizardMachine } from "../wizardMachine";

import type {
  WizardEvent,
  WizardMachineConfig,
  WizardState,
} from "../wizardMachine";

export interface WizardConfig<Step, Shared> extends WizardMachineConfig<
  Step,
  Shared
> {
  readonly failureMessage: string;
}

export interface WizardStore<Step, Shared> {
  readonly getSnapshot: () => WizardState<Step, Shared>;
  readonly subscribe: (listener: () => void) => () => void;
  readonly go: (step: Step) => void;
  readonly back: () => void;
  readonly setShared: (next: Shared | ((previous: Shared) => Shared)) => void;
  readonly close: () => boolean;
  readonly advance: <T>(
    task: () => Promise<T>,
    next: (value: T) => Step,
  ) => Promise<void>;
  readonly complete: <T>(task: () => Promise<T>) => Promise<boolean>;
}

export function createWizardStore<Step, Shared>(
  config: WizardConfig<Step, Shared>,
  initialShared: Shared = config.initialShared,
): WizardStore<Step, Shared> {
  const machine = createWizardMachine<Step, Shared>({
    initialStep: config.initialStep,
    initialShared,
    getBackStep: config.getBackStep,
  });

  let state = machine.initial;
  let nextRequestId = 0;
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const apply = (event: WizardEvent<Step, Shared>) => {
    const next = machine.reduce(state, event);

    if (next === state) return;

    state = next;
    emit();
  };

  const isCurrent = (requestId: number) => state.requestId === requestId;

  const run = async <T>(
    task: () => Promise<T>,
    settle: (value: T, requestId: number) => WizardEvent<Step, Shared>,
  ): Promise<boolean> => {
    if (state.requestId !== null) return false;

    const requestId = nextRequestId;
    nextRequestId += 1;
    apply({ type: "begin", requestId });

    try {
      const value = await task();

      if (!isCurrent(requestId)) return false;

      apply(settle(value, requestId));
      return true;
    } catch (failure) {
      if (!isCurrent(requestId)) return false;

      apply({
        type: "fail",
        requestId,
        message: errorMessage(failure, config.failureMessage),
      });
      return false;
    }
  };

  const go = (step: Step) => {
    apply({ type: "navigate", step });
  };

  const back = () => {
    const target = machine.backStep(state);

    if (target !== null) go(target);
  };

  const setShared = (next: Shared | ((previous: Shared) => Shared)) => {
    const update =
      typeof next === "function"
        ? (next as (previous: Shared) => Shared)
        : () => next;

    apply({ type: "setShared", update });
  };

  const close = () => {
    if (state.requestId !== null) return false;

    apply({ type: "reset" });
    return true;
  };

  const advance = async <T>(
    task: () => Promise<T>,
    next: (value: T) => Step,
  ) => {
    await run(task, (value, requestId) => ({
      type: "succeed",
      requestId,
      step: next(value),
    }));
  };

  const complete = <T>(task: () => Promise<T>) =>
    run(task, (_value, requestId) => ({ type: "finish", requestId }));

  return {
    getSnapshot: () => state,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    go,
    back,
    setShared,
    close,
    advance,
    complete,
  };
}
