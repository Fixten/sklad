import { z } from "zod";

import { ErrorMessages } from "../constants/Errors.js";
import { getFullPathname } from "../utils/getFullPathname.js";

import { DeletedMessageZ, ErrorResponseZ } from "./common.zod.js";

export const jsonContent = (schema: z.ZodType) => ({
  "application/json": { schema },
});

export const errors = {
  400: { description: ErrorMessages.INVALID_REQUEST, content: jsonContent(ErrorResponseZ) },
  404: { description: ErrorMessages.RESOURCE_NOT_FOUND, content: jsonContent(ErrorResponseZ) },
  409: { description: ErrorMessages.CONFLICT, content: jsonContent(ErrorResponseZ) },
  500: { description: ErrorMessages.INTERNAL_SERVER_ERROR, content: jsonContent(ErrorResponseZ) },
};

export const deletedContent = jsonContent(DeletedMessageZ);

export const paramsOf = (schema: z.ZodObject) => ({ params: schema });

export const bodyOf = (schema: z.ZodType) => ({
  body: { required: true, content: jsonContent(schema) },
});

export const itemPath = (url: string) => `${getFullPathname(url)}/{id}`;