import { ErrorMessages } from "../constants/Errors";

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

export const fetchApi = async <R>(
  url: URL,
  method: Method,
  body?: string,
): Promise<R> => {
  const response = await fetch(url, { method, body, headers }).catch(() => {
    throw new ApiError(ErrorMessages.FAILED_REQUEST, 0);
  });

  const throwInvalidJson = () => {
    throw new ApiError(ErrorMessages.INVALID_JSON_RESPONSE, response.status);
  };

  const data: unknown = await response.json().catch(throwInvalidJson);
  if (data === null) throwInvalidJson();
  if (!response.ok) throw getServerError(response.status, data);

  return data as R;
};
