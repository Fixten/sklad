import { ErrorRequestHandler } from "express";

import { ErrorMessages } from "./constants/Errors.js";
import { ErrorResponseZ } from "./openapi/common.zod.js";
import { Logger } from "./utils/logger.js";

const badRequestMessages = [
  ErrorMessages.DB_OPERATION_FAILED,
  ErrorMessages.UNIT_CHANGE_AFTER_USAGE,
  ErrorMessages.INVALID_DECIMAL_VALUE,
  ErrorMessages.INVALID_DECIMAL_PRECISION,
  ErrorMessages.QUANTITY_NOT_POSITIVE,
  ErrorMessages.PRICE_NEGATIVE,
] as string[];

const conflictMessages = [
  ErrorMessages.ITEM_DELETED,
  ErrorMessages.NAME_ALREADY_EXISTS,
  ErrorMessages.QUANTITY_BELOW_CONSUMED,
  ErrorMessages.QUANTITY_REQUIRED_FOR_UNIT_CHANGE,
  ErrorMessages.REFERENCED_ITEM_DELETED,
  ErrorMessages.VARIANT_CHANGE_AFTER_USAGE,
] as string[];

const NOT_FOUND_MESSAGES = [
  ErrorMessages.ITEM_NOT_FOUND,
  ErrorMessages.ITEM_TO_DELETE_NOT_FOUND,
] as string[];

const isDomainError = (error: unknown) =>
  error instanceof Error &&
  (NOT_FOUND_MESSAGES.includes(error.message) ||
    badRequestMessages.includes(error.message) ||
    conflictMessages.includes(error.message));

function toStatus(error: unknown): number {
  if (error instanceof Error && NOT_FOUND_MESSAGES.includes(error.message))
    return 404;

  if (error instanceof Error && badRequestMessages.includes(error.message))
    return 400;

  if (error instanceof Error && conflictMessages.includes(error.message))
    return 409;

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
  const status = toStatus(error);
  if (status === 500) Logger.error(error);
  if (status === 409) Logger.error(error);

  let message: string = ErrorMessages.INTERNAL_SERVER_ERROR;
  if (status === 409)
    message = isDomainError(error)
      ? (error as Error).message
      : ErrorMessages.CONFLICT;
  else if (status !== 500 && error instanceof Error) message = error.message;

  let body: { message: string };
  try {
    body = ErrorResponseZ.parse({ message });
  } catch {
    body = { message: ErrorMessages.INTERNAL_SERVER_ERROR };
  }

  res.status(status).json(body);
};
