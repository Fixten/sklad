import { vi } from "vitest";

import { getApiUrl } from "@/api/helpers";

import type { paths } from "@/api/schema";
import type { JsonBody, JsonResponse } from "@/api/schema-helpers";

export interface RecordedRequest {
  path: string;
  method: string;
  body: unknown;
}

type Operation = "get" | "post" | "patch" | "delete";

type CollectionPath = Exclude<keyof paths, `${string}{${string}`>;

type Reply<P extends keyof paths, M extends Operation> =
  JsonResponse<P, M> | Response;

type Handler<P extends keyof paths, M extends Operation> = (request: {
  body: JsonBody<P, M>;
}) => Reply<P, M> | Promise<Reply<P, M>>;

export type Routes = {
  [P in CollectionPath]?: {
    [M in Extract<keyof paths[P], Operation>]?: Handler<P, M>;
  };
};

type AnyHandler = (request: { body: unknown }) => unknown;

const unhandled: string[] = [];

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const errorResponse = (status: number, message: string) =>
  jsonResponse({ message }, status);

export const takeUnhandledRequests = () => unhandled.splice(0);

export const stubRoutes = (routes: Routes) => {
  const requests: RecordedRequest[] = [];
  const operations = Object.entries(routes).flatMap(([path, methods]) =>
    Object.entries(methods).map(([method, handler]) => ({
      key: `${method.toUpperCase()} ${getApiUrl(path).pathname}`,
      handler: handler as AnyHandler,
    })),
  );

  const fetchMock = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const href =
      input instanceof URL
        ? input.href
        : typeof input === "string"
          ? input
          : input.url;
    const url = new URL(href);
    const method = (init?.method ?? "GET").toUpperCase();
    const body: unknown = init?.body
      ? JSON.parse(init.body as string)
      : undefined;
    const key = `${method} ${url.pathname}`;

    requests.push({ path: url.pathname, method, body });

    const operation = operations.find((candidate) => candidate.key === key);

    if (!operation) {
      unhandled.push(key);

      return errorResponse(404, "unexpected request");
    }

    const reply: unknown = await operation.handler({ body });

    return reply instanceof Response ? reply : jsonResponse(reply);
  };

  vi.stubGlobal("fetch", vi.fn(fetchMock));

  return requests;
};
