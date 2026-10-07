const pickCorrectBase = () =>
  (import.meta.env.VITE_BACKEND_URL as string | undefined) ??
  `http://localhost:${import.meta.env.VITE_BACKEND_PORT as string}`;

const getApiUrl = (path: string) => new URL(path, `${pickCorrectBase()}/`);

export type ResponseBody<B> = B;

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
  get<G = B>(slug?: string | number) {
    return fetchApi<ResponseBody<G>>(
      slug !== undefined
        ? getApiUrl(`${this.#apiUrl.pathname}/${String(slug)}`)
        : this.#apiUrl,
      "GET",
    );
  }
  getAll() {
    return fetchApi<ResponseBody<B>[]>(this.#apiUrl, "GET");
  }
  post<R>(body: unknown, slug?: string | number) {
    return fetchApi<ResponseBody<R>>(
      slug !== undefined
        ? getApiUrl(`${this.#apiUrl.pathname}/${String(slug)}`)
        : this.#apiUrl,
      "POST",
      JSON.stringify(body),
    );
  }

  remove(...args: (string | number)[]) {
    const params = args.map((v) => `/${String(v)}`).join("");
    return fetchApi<{ message: string }>(
      getApiUrl(`${this.#apiUrl.pathname}${params}`),
      "DELETE",
    );
  }
}
