import { describe, expect, it } from "vitest";

import {
  areFeaturesEnabled,
  isFeatureEnabled,
  isMaterialEnabled,
} from "@/config/features";

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

describe("areFeaturesEnabled", () => {
  it("requires every feature to be enabled", () => {
    expect(areFeaturesEnabled(["material", "supply"], {})).toBe(true);
    expect(areFeaturesEnabled(["material", "supply"], { supply: false })).toBe(
      false,
    );
  });
});

describe("isMaterialEnabled", () => {
  it.each(["materialType", "materialVariant", "material"] as const)(
    "is disabled when %s is disabled",
    (name) => {
      expect(isMaterialEnabled({ [name]: false })).toBe(false);
    },
  );

  it("is enabled when all material features are enabled", () => {
    expect(
      isMaterialEnabled({
        materialType: true,
        materialVariant: true,
        material: true,
      }),
    ).toBe(true);
  });
});
