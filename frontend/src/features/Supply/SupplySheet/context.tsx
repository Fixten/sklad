import { createContext, useContext, useRef, useState } from "react";

import { useSheetFlow, type FlowTask } from "@/lib/useSheetFlow/useSheetFlow";

import { supplyInitialStep, SupplyStep, SupplyStepKind } from "./supplySteps";

interface SupplySheetContextValue {
  step: SupplyStep;
  failure: string | null;
  query: string;
  setQuery: (query: string) => void;
  go: (step: SupplyStep) => void;
  back: () => void;
  close: () => void;
  run: (task: FlowTask<SupplyStep>) => Promise<void>;
  submitDetails: () => void;
  registerSubmitDetails: (
    submit: (() => void | Promise<void>) | undefined,
  ) => void;
}

const SupplySheetContext = createContext<SupplySheetContextValue | null>(null);

export function useSupplySheetContext() {
  const value = useContext(SupplySheetContext);

  if (!value) {
    throw new Error(
      "useSupplySheetContext must be used inside SupplySheetProvider",
    );
  }

  return value;
}

interface SupplySheetProviderProps {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

export function SupplySheetProvider({
  children,
  onOpenChange,
}: SupplySheetProviderProps) {
  const { step, failure, go, reset, run } = useSheetFlow(supplyInitialStep);
  const [query, setQuery] = useState("");
  const submitRef = useRef<(() => void | Promise<void>) | undefined>(undefined);

  const close = () => {
    reset();
    setQuery("");
    onOpenChange(false);
  };

  const back = () => {
    go({ kind: SupplyStepKind.Pick });
  };

  const submitDetails = () => {
    void submitRef.current?.();
  };

  const registerSubmitDetails = (
    submit: (() => void | Promise<void>) | undefined,
  ) => {
    submitRef.current = submit;
  };

  return (
    <SupplySheetContext.Provider
      value={{
        step,
        failure,
        query,
        setQuery,
        go,
        back,
        close,
        run,
        submitDetails,
        registerSubmitDetails,
      }}
    >
      {children}
    </SupplySheetContext.Provider>
  );
}
