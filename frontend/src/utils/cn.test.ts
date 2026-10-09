import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("keeps the last of conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps non-conflicting classes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("drops falsy inputs", () => {
    expect(cn("px-2", false, undefined, null, "", "py-4")).toBe("px-2 py-4");
  });
});
