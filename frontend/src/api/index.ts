import { ErrorMessages } from "../constants/Errors";

import type { paths } from "./schema";
import type { JsonBody, JsonResponse } from "./schema-helpers";

type ApiPath = keyof paths;
type ItemPath<P extends ApiPath> = `${P}/{id}`;

export type Id = string | number;

const pickCorrectBase = () =>
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  `http://localhost:${import.meta.env.VITE_BACKEND_PORT as string}`;

const getApiUrl = (path: string) =>
  new URL(path.replace(/^\/api\//, ""), `${pickCorrectBase()}/`);

type Method = "GET" | "POST" | "PATCH" | "DELETE";

const headers: HeadersInit = { "Content-Type": "application/json" };

const fetchApi = <R>(url: URL, method: Method, body?: string) =>
  fetch(url, { method, body, headers }).then((response) => {
    if (response.ok) return response.json() as Promise<R>;
    else throw new Error(ErrorMessages.NETWORK_RESPONSE_NOT_OK);
  });

export default class Api<P extends ApiPath> {
  private apiUrl: URL;

  constructor(path: P) {
    this.apiUrl = getApiUrl(path);
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

  getAll() {
    return fetchApi<JsonResponse<P, "get">>(this.apiUrl, "GET");
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
}
