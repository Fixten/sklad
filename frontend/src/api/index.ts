import { ApiModel } from "./api.model";

const pickCorrectBase = () =>
  `${import.meta.env.VITE_BACKEND_URL as string}:${import.meta.env.VITE_BACKEND_PORT as string}`;

const getApiUrl = (path: string) => new URL(path, pickCorrectBase());

export type ResponseBody<B> = B & ApiModel;

type Method = "GET" | "POST";

const headers: HeadersInit = { "Content-Type": "application/json" };

const fetchApi = <R>(url: URL, method: Method, body?: string) =>
  fetch(url, { method, body, headers }).then((response) => {
    if (response.ok) return response.json() as Promise<ResponseBody<R>>;
    else throw new Error("Network response was not ok");
  });

export default class Api<B> {
  #apiUrl: URL;
  constructor(path: string) {
    this.#apiUrl = getApiUrl(path);
  }
  get() {
    return fetchApi<B>(this.#apiUrl, "GET");
  }
  post<R>(body: unknown): Promise<R> {
    return fetchApi<R>(this.#apiUrl, "POST", JSON.stringify(body));
  }
}
