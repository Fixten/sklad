import { ErrorResponseZ } from "./common.zod.js";

import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function sendError(res: Response, status: number, message: string) {
  res.status(status).json(ErrorResponseZ.parse({ message }));
}

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      sendError(res, 400, result.error.message);
      return;
    }
    next();
  };
}

export function validateParams(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      sendError(res, 400, result.error.message);
      return;
    }
    next();
  };
}

export function sendSpec(schema: ZodType) {
  return (res: Response, data: unknown) => {
    const wire: unknown =
      data === undefined ? undefined : JSON.parse(JSON.stringify(data));
    res.json(schema.parse(wire));
  };
}