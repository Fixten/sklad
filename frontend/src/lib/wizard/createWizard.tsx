import { createContext, useContext } from "react";

import { useSheetFlow, type FlowTask } from "@/lib/useSheetFlow/useSheetFlow";

import type { ReactNode } from "react";

export interface WizardContextValue<Step, Shared> {
  open: boolean;
  step: Step;
  failure: string | null;
  busy: boolean;
  shared: Shared;
  go: (step: Step) => void;
  back: () => void;
  close: () => void;
  handleOpenChange: (open: boolean) => void;
  run: (task: FlowTask<Step>) => Promise<void>;
}

export interface WizardConfig<Step> {
  initialStep: Step;
  getBackStep?: (step: Step) => Step | null;
}

interface WizardProviderProps<Shared> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shared: Shared;
  onClose?: () => void;
  children: ReactNode;
}

export function createWizard<Step, Shared>(config: WizardConfig<Step>) {
  const WizardContext = createContext<WizardContextValue<Step, Shared> | null>(
    null,
  );

  function WizardProvider({
    open,
    onOpenChange,
    shared,
    onClose,
    children,
  }: WizardProviderProps<Shared>) {
    const { step, failure, busy, go, reset, run } = useSheetFlow(
      config.initialStep,
    );

    const handleOpenChange = (next: boolean) => {
      if (!next) {
        onClose?.();
        reset();
      }

      onOpenChange(next);
    };

    const close = () => {
      handleOpenChange(false);
    };

    const back = () => {
      const target = config.getBackStep?.(step);

      if (target) go(target);
    };

    return (
      <WizardContext.Provider
        value={{
          open,
          step,
          failure,
          busy,
          shared,
          go,
          back,
          close,
          handleOpenChange,
          run,
        }}
      >
        {children}
      </WizardContext.Provider>
    );
  }

  function useWizard() {
    const value = useContext(WizardContext);
    if (!value) {
      throw new Error("useWizard must be used inside its wizard provider");
    }
    return value;
  }

  return { Provider: WizardProvider, useWizard };
}
