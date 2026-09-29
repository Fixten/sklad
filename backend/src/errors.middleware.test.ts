import { Response } from "express";

import { ErrorMessages } from "@/constants/Errors.js";

import { errorHandler } from "./errors.middleware.js";

function invoke(error: unknown) {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }) as unknown as Response);
  errorHandler(
    error,
    {} as never,
    { status } as unknown as Response,
    jest.fn() as never,
  );
  return { status, json };
}

function sqliteConflict() {
  return Object.assign(
    new Error("UNIQUE constraint failed: material_types.name"),
    { code: "SQLITE_CONSTRAINT_UNIQUE" },
  );
}

describe("errorHandler", () => {
  test("returns a conflict error's own message", () => {
    const { status, json } = invoke(new Error(ErrorMessages.ITEM_DELETED));
    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({ message: ErrorMessages.ITEM_DELETED });
  });

  test("returns a duplicate-name conflict's own message", () => {
    const { status, json } = invoke(new Error(ErrorMessages.NAME_ALREADY_EXISTS));
    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      message: ErrorMessages.NAME_ALREADY_EXISTS,
    });
  });

  test("hides the details of a raw database constraint error", () => {
    const { status, json } = invoke(sqliteConflict());
    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({ message: ErrorMessages.CONFLICT });
    expect(json).not.toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("UNIQUE constraint failed"),
      }),
    );
  });

  test("returns not-found and bad-request messages unchanged", () => {
    const missing = invoke(new Error(ErrorMessages.ITEM_NOT_FOUND));
    expect(missing.status).toHaveBeenCalledWith(404);
    expect(missing.json).toHaveBeenCalledWith({
      message: ErrorMessages.ITEM_NOT_FOUND,
    });

    const invalid = invoke(new Error(ErrorMessages.UNIT_CHANGE_AFTER_USAGE));
    expect(invalid.status).toHaveBeenCalledWith(400);
    expect(invalid.json).toHaveBeenCalledWith({
      message: ErrorMessages.UNIT_CHANGE_AFTER_USAGE,
    });
  });

  test("masks an unrecognised error as internal", () => {
    const { status, json } = invoke(new Error("connection lost"));
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  });
});
