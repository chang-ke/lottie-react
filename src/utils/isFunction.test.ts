import { describe, expect, it } from "vitest";

import isFunction from "./isFunction";

describe("isFunction", () => {
  it("returns true for a function", () => {
    expect(isFunction(() => undefined)).toBe(true);
    expect(
      isFunction(function named() {
        return undefined;
      }),
    ).toBe(true);
    expect(
      isFunction(
        class Foo {
          value = 1;
        },
      ),
    ).toBe(true);
  });

  it("returns false for non-function values", () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(42)).toBe(false);
    expect(isFunction("string")).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});
