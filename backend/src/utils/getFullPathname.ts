import { Urls } from "../constants/Urls.js";

export const getFullPathname = (url: string) => `${Urls.apiBase}${url}`;