import { getFullPathname } from "./getFullPathname.js";

describe("getFullPathname", () => {
  test("prepends the api base to a plain path", () => {
    expect(getFullPathname("/material")).toBe("/api/material");
  });

  test("prepends the api base to a path with a trailing slash", () => {
    expect(getFullPathname("/material/")).toBe("/api/material/");
  });

  test("prepends the api base to a nested path", () => {
    expect(getFullPathname("/docs/spec.json")).toBe("/api/docs/spec.json");
  });
});