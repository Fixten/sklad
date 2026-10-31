import { ErrorMessages } from "@/constants/Errors";

import { ApiError, getServerError } from "./api-error";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const headers: HeadersInit = { "Content-Type": "application/json" };

export const pickCorrectBase = () =>
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  `http://localhost:${import.meta.env.VITE_BACKEND_PORT as string}`;

export const getApiUrl = (path: string) =>
  new URL(path.replace(/^\/api\//, ""), `${pickCorrectBase()}/`);

export const applySearchParams = (
  url: URL,
  params: object | null | undefined,
): void => {
  if (typeof params === "object" && params !== null) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      else url.searchParams.set(key, String(value));
    });
  }
};

export const REQUEST_TIMEOUT_MS = 10_000;

export const fetchApi = async <R>(
  url: URL,
  method: Method,
  body?: string,
): Promise<R> => {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const isAbort = (error: unknown) =>
    (error instanceof DOMException && error.name === "AbortError") ||
    controller.signal.aborted;

  const throwTimeout = () => {
    throw new ApiError(ErrorMessages.REQUEST_TIMEOUT, 408);
  };

  const throwInvalidJson = (status: number) => {
    throw new ApiError(ErrorMessages.INVALID_JSON_RESPONSE, status);
  };

  try {
    const response = await fetch(url, {
      method,
      body,
      headers,
      signal: controller.signal,
    });

    let data: unknown;
    try {
      data = await response.json();
    } catch (jsonError) {
      if (isAbort(jsonError)) throwTimeout();
      throwInvalidJson(response.status);
    }

    if (data === null) throwInvalidJson(response.status);
    if (!response.ok) throw getServerError(response.status, data);

    return data as R;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAbort(error)) throwTimeout();
    throw new ApiError(ErrorMessages.FAILED_REQUEST, 0);
  } finally {
    clearTimeout(timer);
  }
};
