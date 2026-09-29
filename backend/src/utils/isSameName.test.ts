import { isSameName } from "./isSameName.js";

describe("isSameName", () => {
  test("ignores case differences", () => {
    expect(isSameName("Oak plank", "oak plank")).toBe(true);
    expect(isSameName("Дуб", "дуб")).toBe(true);
  });

  test("keeps different names apart", () => {
    expect(isSameName("Oak plank", "Ash")).toBe(false);
  });

  test("keeps accents apart", () => {
    expect(isSameName("е", "ё")).toBe(false);
  });
});
