import { describe, expect, it } from "vitest";

import getNumberFromNumberOrPercentage from "./getNumberFromNumberOrPercentage";

describe("getNumberFromNumberOrPercentage", () => {
  it("returns number and isPercentage=false for an integer", () => {
    expect(getNumberFromNumberOrPercentage(42)).toEqual({
      number: 42,
      isPercentage: false,
    });
  });

  it("returns number and isPercentage=false for a float", () => {
    expect(getNumberFromNumberOrPercentage(3.14)).toEqual({
      number: 3.14,
      isPercentage: false,
    });
  });

  it("returns number and isPercentage=false for a numeric string", () => {
    expect(getNumberFromNumberOrPercentage("50")).toEqual({
      number: 50,
      isPercentage: false,
    });
  });

  it("returns number and isPercentage=true for a percentage string", () => {
    expect(getNumberFromNumberOrPercentage("50%")).toEqual({
      number: 50,
      isPercentage: true,
    });
  });

  it("handles 0 and 0%", () => {
    expect(getNumberFromNumberOrPercentage(0)).toEqual({
      number: 0,
      isPercentage: false,
    });
    expect(getNumberFromNumberOrPercentage("0%")).toEqual({
      number: 0,
      isPercentage: true,
    });
  });

  it("handles fractional percentages", () => {
    expect(getNumberFromNumberOrPercentage("0.5%")).toEqual({
      number: 0.5,
      isPercentage: true,
    });
  });

  it("returns null for a negative number string", () => {
    expect(getNumberFromNumberOrPercentage("-1")).toBeNull();
  });

  it("returns null for a non-numeric string", () => {
    expect(getNumberFromNumberOrPercentage("abc")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(getNumberFromNumberOrPercentage("")).toBeNull();
  });

  it("returns null for a string with non-% suffix", () => {
    expect(getNumberFromNumberOrPercentage("50px")).toBeNull();
  });
});
