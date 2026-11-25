import { expect, test } from "vitest";

import { formatLocalDate } from "./date";

test("formats a timestamp as a local calendar date", () => {
  const originalTimezone = process.env.TZ;

  try {
    process.env.TZ = "Europe/Moscow";

    expect(formatLocalDate("2026-03-15T23:30:00.000Z")).toBe("2026-03-16");
  } finally {
    if (originalTimezone === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTimezone;
    }
  }
});
