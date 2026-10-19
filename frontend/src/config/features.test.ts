import { describe, expect, it } from "vitest";

import { isFeatureEnabled } from "@/config/features";

describe("isFeatureEnabled", () => {
  it("treats an unlisted feature as enabled", () => {
    expect(isFeatureEnabled("settings", {})).toBe(true);
  });

  it("disables a feature only with a false value", () => {
    expect(isFeatureEnabled("settings", { settings: false })).toBe(false);
    expect(isFeatureEnabled("settings", { settings: true })).toBe(true);
    expect(isFeatureEnabled("settings", { settings: "false" })).toBe(true);
  });
});
