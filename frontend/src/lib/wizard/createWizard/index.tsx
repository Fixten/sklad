import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";

import { createWizardStore } from "../wizardStore";

import type { WizardConfig, WizardStore } from "../wizardStore";
import type { ReactNode } from "react";

export type { WizardConfig } from "../wizardStore";

export interface WizardApi<Step, Shared> {
  step: Step;
  shared: Shared;
  setShared: (next: Shared | ((prev: Shared) => Shared)) => void;
  pending: boolean;
  error: string | null;
  canGoBack: boolean;
  go: (step: Step) => void;
  back: () => void;
  close: () => void;
  advance: <T>(
    task: () => Promise<T>,
    next: (value: T) => Step,
  ) => Promise<void>;
  complete: <T>(task: () => Promise<T>) => Promise<void>;
}

interface WizardProviderProps<Shared> {
  initialShared?: Shared;
  onClose?: () => void;
  children: ReactNode;
}

interface WizardContextValue<Step, Shared> {
  store: WizardStore<Step, Shared>;
  onClose?: () => void;
}

export function createWizard<Step, Shared>(config: WizardConfig<Step, Shared>) {
  const WizardContext = createContext<WizardContextValue<Step, Shared> | null>(
    null,
  );

  function WizardProvider({
    initialShared = config.initialShared,
    onClose,
    children,
  }: WizardProviderProps<Shared>) {
    const [store] = useState(() => createWizardStore(config, initialShared));

    return (
      <WizardContext.Provider value={{ store, onClose }}>
        {children}
      </WizardContext.Provider>
    );
  }

  function useWizard() {
    const context = useContext(WizardContext);

    if (!context) {
      throw new Error("useWizard must be used inside its wizard provider");
    }

    const state = useSyncExternalStore(
      context.store.subscribe,
      context.store.getSnapshot,
    );

    const value: WizardApi<Step, Shared> = {
      step: state.step,
      shared: state.shared,
      setShared: context.store.setShared,
      pending: state.requestId !== null,
      error: state.error,
      canGoBack: config.getBackStep?.(state.step) != null,
      go: context.store.go,
      back: context.store.back,
      close: () => {
        if (context.store.close()) context.onClose?.();
      },
      advance: context.store.advance,
      complete: async (task) => {
        if (await context.store.complete(task)) context.onClose?.();
      },
    };

    return value;
  }

  return { Provider: WizardProvider, useWizard };
}
