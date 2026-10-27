import { describe, expect, it } from "vitest";

import { normalizeName, sameName } from "./text";

describe("normalizeName", () => {
  it("drops outer spaces and case", () => {
    expect(normalizeName(" Столярный двор ")).toBe("столярный двор");
  });
});

describe("sameName", () => {
  it("compares names without case and outer spaces", () => {
    expect(sameName(" Столярный двор ", "столярный двор")).toBe(true);
    expect(sameName("Столярный двор", "Лесоторг")).toBe(false);
  });
});
