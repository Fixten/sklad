import { vi } from "vitest";

import { createApiStub } from "./apiStub";

import type { Routes } from "./apiStub";

export { errorResponse, takeUnhandledRequests } from "./apiStub";

export const stubRoutes = (routes: Routes) => {
  const { fetch, requests } = createApiStub(routes);
  vi.stubGlobal("fetch", vi.fn(fetch));

  return requests;
};
