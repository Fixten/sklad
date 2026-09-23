import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const dateZ = z.iso.datetime();

export const IdParamsZ = z.object({
  id: z.string().regex(/^\d+$/u).transform(Number),
});

export const IdParamsDocZ = z.object({
  id: z.string().regex(/^\d+$/u),
});

export const ErrorResponseZ = z.object({ message: z.string() }).strict();

export const DeletedMessageZ = z.object({ message: z.string() }).strict();