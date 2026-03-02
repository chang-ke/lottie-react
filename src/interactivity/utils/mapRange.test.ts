import { describe, expect, it } from "vitest";

import { mapRange } from "./mapRange";

describe("mapRange", () => {
  it("maps the midpoint correctly", () => {
    expect(mapRange(0.5, [0, 1], [0, 100])).toBe(50);
  });

  it("maps the minimum boundary", () => {
    expect(mapRange(0, [0, 1], [0, 100])).toBe(0);
  });

  it("maps the maximum boundary", () => {
    expect(mapRange(1, [0, 1], [0, 100])).toBe(100);
  });

  it("clamps values below inMin to outMin", () => {
    expect(mapRange(-1, [0, 1], [0, 100])).toBe(0);
  });

  it("clamps values above inMax to outMax", () => {
    expect(mapRange(2, [0, 1], [0, 100])).toBe(100);
  });

  it("returns outMin when inRange has zero span", () => {
    expect(mapRange(5, [5, 5], [0, 100])).toBe(0);
  });

  it("works with a non-zero-based output range", () => {
    expect(mapRange(0.5, [0, 1], [10, 20])).toBe(15);
  });

  it("works with an inverted output range", () => {
    expect(mapRange(0.25, [0, 1], [100, 0])).toBe(75);
  });

  it("works with negative output ranges", () => {
    expect(mapRange(0.5, [0, 1], [-100, 0])).toBe(-50);
  });
});
