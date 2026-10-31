import { describe, expect, it } from "vitest";

import { errorMessage } from "./errorMessage";

describe("errorMessage", () => {
  it("uses the message of an error", () => {
    expect(
      errorMessage(new Error("Недостаточно прав"), "Не удалось сохранить"),
    ).toBe("Недостаточно прав");
  });

  it("falls back for a value that carries no message", () => {
    expect(errorMessage("boom", "Не удалось сохранить")).toBe(
      "Не удалось сохранить",
    );
  });
});
