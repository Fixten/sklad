import { ApiModel } from "./api.model";

const pickCorrectBase = () =>
  (import.meta.env.VITE_BACKEND_URL as string) ??
  `http://localhost:${import.meta.env.VITE_BACKEND_PORT as string}`;

const getApiUrl = (path: string) => new URL(path, `${pickCorrectBase()}/`);

export type ResponseBody<B> = B & ApiModel;

type Method = "GET" | "POST" | "DELETE";

const headers: HeadersInit = { "Content-Type": "application/json" };

const fetchApi = <R>(url: URL, method: Method, body?: string) =>
  fetch(url, { method, body, headers }).then((response) => {
    if (response.ok) return response.json() as Promise<R>;
    else throw new Error("Network response was not ok");
  });

export default class Api<B> {
  #apiUrl: URL;
  constructor(path: string) {
    this.#apiUrl = getApiUrl(path);
  }
  get<G = B>(slug?: string) {
    return fetchApi<ResponseBody<G>>(
      slug ? getApiUrl(`${this.#apiUrl.pathname}/${slug}`) : this.#apiUrl,
      "GET"
    );
  }
  getAll() {
    return fetchApi<ResponseBody<B>[]>(this.#apiUrl, "GET");
  }
  post<R>(body: unknown, slug?: string) {
    return fetchApi<ResponseBody<R>>(
      slug ? getApiUrl(`${this.#apiUrl.pathname}/${slug}`) : this.#apiUrl,
      "POST",
      JSON.stringify(body)
    );
  }

  remove(...args: (string | number)[]) {
    const params = args.map((v) => `/${String(v)}`).join("");
    return fetchApi<{ message: string }>(
      getApiUrl(`${this.#apiUrl.pathname}${params}`),
      "DELETE"
    );
  }
}
