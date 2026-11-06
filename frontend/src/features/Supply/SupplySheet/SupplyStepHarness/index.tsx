import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { supplyWizard } from "../supplyWizard";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

interface Props {
  initialQuery?: string;
  children: ReactNode;
}

export default function SupplyStepHarness({
  initialQuery = "",
  children,
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <supplyWizard.Provider initialShared={{ query: initialQuery }}>
        <div className="bg-popover w-full max-w-[560px] p-6">{children}</div>
      </supplyWizard.Provider>
    </QueryClientProvider>
  );
}
