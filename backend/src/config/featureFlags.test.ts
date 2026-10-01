import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { isFeatureEnabled, readFeatureFlags } from "@/config/featureFlags.js";

const dir = mkdtempSync(join(tmpdir(), "sklad-flags-"));

function configPathFor(name: string, content?: string): string {
  const path = join(dir, `${name}.json`);
  if (content !== undefined) writeFileSync(path, content);
  return path;
}

describe("featureFlags", () => {
  describe("isFeatureEnabled", () => {
    it("enables a feature explicitly set to true", () => {
      expect(isFeatureEnabled("material", { material: true })).toBe(true);
    });

    it("disables a feature explicitly set to false", () => {
      expect(isFeatureEnabled("supplier", { supplier: false })).toBe(false);
    });

    it("enables a feature that is not listed", () => {
      expect(isFeatureEnabled("supply", { material: false })).toBe(true);
    });

    it("enables every feature for an empty config", () => {
      expect(isFeatureEnabled("material", {})).toBe(true);
    });

    it.each([["true"], [1], [null], [{}], [[]]])(
      "enables a feature whose value is not a boolean (%p)",
      (value) => {
        expect(isFeatureEnabled("material", { material: value })).toBe(true);
      },
    );
  });

  describe("readFeatureFlags", () => {
    it("reads the features object", () => {
      const path = configPathFor(
        "valid",
        JSON.stringify({ features: { supplier: false } }),
      );
      expect(readFeatureFlags(path)).toEqual({ supplier: false });
    });

    it("returns an empty object for a missing file", () => {
      expect(readFeatureFlags(join(dir, "absent.json"))).toEqual({});
    });

    it("returns an empty object for malformed json", () => {
      expect(readFeatureFlags(configPathFor("broken", "{ nope"))).toEqual({});
    });

    it.each([
      ["a json array", "[]"],
      ["a json string", '"features"'],
      ["null", "null"],
      ["an object without features", "{}"],
      ["a non-object features", '{"features":"nope"}'],
      ["null features", '{"features":null}'],
    ])("returns an empty object for %s", (_label, content) => {
      expect(
        readFeatureFlags(configPathFor(`shape-${_label}`, content)),
      ).toEqual({});
    });

    it("combines with isFeatureEnabled so unreadable config means enabled", () => {
      const features = readFeatureFlags(configPathFor("broken2", "{ nope"));
      expect(isFeatureEnabled("material", features)).toBe(true);
      expect(isFeatureEnabled("supplier", features)).toBe(true);
    });
  });
});
