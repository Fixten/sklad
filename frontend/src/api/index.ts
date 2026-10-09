import { applySearchParams, fetchApi, getApiUrl } from "./helpers";

import type { paths } from "./schema";
import type { JsonBody, JsonQuery, JsonResponse } from "./schema-helpers";

type ApiPath = keyof paths;
type ItemPath<P extends ApiPath> = `${P}/{id}`;
type RestorePath<P extends ApiPath> = `${P}/restore/{id}`;

export type Id = string | number;

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
