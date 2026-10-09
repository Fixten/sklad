import { ErrorMessages } from "../constants/Errors";

import { ApiError, getServerError } from "./api-error";

import type { paths } from "./schema";
import type { JsonBody, JsonQuery, JsonResponse } from "./schema-helpers";

type ApiPath = keyof paths;
type ItemPath<P extends ApiPath> = `${P}/{id}`;
type RestorePath<P extends ApiPath> = `${P}/restore/{id}`;

export type Id = string | number;

const pickCorrectBase = () =>
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  `http://localhost:${import.meta.env.VITE_BACKEND_PORT as string}`;

const getApiUrl = (path: string) =>
  new URL(path.replace(/^\/api\//, ""), `${pickCorrectBase()}/`);

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const headers: HeadersInit = { "Content-Type": "application/json" };

const applySearchParams = (
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

const fetchApi = async <R>(
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

export default class Api<P extends ApiPath> {
  private apiUrl: URL;

  constructor(path: P) {
    const basePath = path.endsWith("/{id}")
      ? path.slice(0, -"/{id}".length)
      : path;
    this.apiUrl = getApiUrl(basePath);
  }

  private getUrlWithId(id: Id) {
    return new URL(`${this.apiUrl.pathname}/${String(id)}`, this.apiUrl.origin);
  }

  get(id: Id) {
    return fetchApi<JsonResponse<ItemPath<P>, "get">>(
      this.getUrlWithId(id),
      "GET",
    );
  }

  getAll(params?: JsonQuery<P, "get">) {
    const url = new URL(this.apiUrl);
    applySearchParams(url, params);
    return fetchApi<JsonResponse<P, "get">>(url, "GET");
  }

  post(body: JsonBody<P, "post">) {
    return fetchApi<JsonResponse<P, "post">>(
      this.apiUrl,
      "POST",
      JSON.stringify(body),
    );
  }

  patch(body: JsonBody<ItemPath<P>, "patch">, id: Id) {
    return fetchApi<JsonResponse<ItemPath<P>, "patch">>(
      this.getUrlWithId(id),
      "PATCH",
      JSON.stringify(body),
    );
  }

  remove(id: Id) {
    return fetchApi<JsonResponse<ItemPath<P>, "delete">>(
      this.getUrlWithId(id),
      "DELETE",
    );
  }

  restore(id: Id) {
    return fetchApi<JsonResponse<RestorePath<P>, "post">>(
      new URL(
        `${this.apiUrl.pathname}/restore/${String(id)}`,
        this.apiUrl.origin,
      ),
      "POST",
    );
  }
}
