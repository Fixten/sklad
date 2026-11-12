import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const dateZ = z.iso.datetime();

export const listQueryZ = z
  .object({
    hidden: z
      .enum(["true", "false"])
      .transform((value) => value === "true")
      .optional(),
  })
  .strict();

export const IdParamsZ = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const IdParamsDocZ = z.object({
  id: z.string().regex(/^\d+$/),
});

export const ErrorResponseZ = z.object({ message: z.string() }).strict();

export const DeletedMessageZ = z.object({ message: z.string() }).strict();
