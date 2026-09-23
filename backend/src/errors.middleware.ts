import { ErrorRequestHandler } from "express";

import { ErrorMessages } from "./constants/Errors.js";
import { ErrorResponseZ } from "./openapi/common.zod.js";

const badRequestMessages = [
  ErrorMessages.DB_OPERATION_FAILED,
  ErrorMessages.UNIT_CHANGE_AFTER_USAGE,
  ErrorMessages.WRONG_UNIT,
] as string[];

const NOT_FOUND_MESSAGES = [
  ErrorMessages.ITEM_NOT_FOUND,
  ErrorMessages.ITEM_TO_DELETE_NOT_FOUND,
] as string[];

function toStatus(error: unknown): number {
  if (
    error instanceof Error &&
    NOT_FOUND_MESSAGES.includes(error.message)
  )
    return 404;

  if (
    error instanceof Error &&
    badRequestMessages.includes(error.message)
  )
    return 400;

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    error.type === "entity.parse.failed"
  )
    return 400;

  const code = (error as { code?: string } | null)?.code ?? "";
  if (code.startsWith("SQLITE_CONSTRAINT")) return 409;

  return 500;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next;
  const status = toStatus(error);
  if (status === 500) console.error(error);
  if (status === 409) console.error(error);

  let message: string = ErrorMessages.INTERNAL_SERVER_ERROR;
  if (status === 409) message = ErrorMessages.CONFLICT;
  else if (status !== 500 && error instanceof Error) message = error.message;

  let body: { message: string };
  try {
    body = ErrorResponseZ.parse({ message });
  } catch {
    body = { message: ErrorMessages.INTERNAL_SERVER_ERROR };
  }

  res.status(status).json(body);
};