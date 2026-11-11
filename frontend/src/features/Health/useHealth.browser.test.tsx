import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { errorResponse } from "@/test/apiStub";
import { stubRoutes } from "@/test/apiStub.vitest";
import Toaster from "@ui/Toast";

import BackendProbe from "./BackendProbe";

test("reports a backend outage as an error toast", async () => {
  stubRoutes({
    "/api/health": { get: () => errorResponse(503, "unavailable") },
  });

  const screen = await render(
    <QueryClientProvider client={new QueryClient()}>
      <BackendProbe />
      <Toaster />
    </QueryClientProvider>,
  );

  await expect.element(screen.getByText("Сервер недоступен")).toBeVisible();
});
