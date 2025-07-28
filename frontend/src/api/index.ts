import { ApiModel } from "./api.model";

const getApiUrl = (path: string) =>
  new URL(
    path,
    `${window.location.protocol}//${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`
  );

export type ResponseBody<B> = B & ApiModel;

const fetchApi = <B>(url: URL) =>
  fetch(url).then((response) => {
    if (response.ok) return response.json() as Promise<ResponseBody<B>>;
    else throw new Error("Network response was not ok");
  });

export default class Api<B> {
  #apiUrl: URL;
  constructor(path: string) {
    this.#apiUrl = getApiUrl(path);
  }
  get() {
    return fetchApi<B>(this.#apiUrl);
  }
}
