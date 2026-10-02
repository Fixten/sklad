import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readFeatureFlags } from "@/config/featureFlags.js";

const dir = mkdtempSync(join(tmpdir(), "sklad-flags-"));

function configPathFor(name: string, content?: string): string {
  const path = join(dir, `${name}.json`);
  if (content !== undefined) writeFileSync(path, content);
  return path;
}

describe("featureFlags", () => {
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
  });
});
