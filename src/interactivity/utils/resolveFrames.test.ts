import { describe, expect, it } from "vitest";

import { resolveFrame } from "./resolveFrames";

import type { AnimationItem } from "lottie-web";

const makeItem = (
  totalFrames = 100,
  markers: { payload?: { name?: string }; time: number }[] = [],
): AnimationItem => ({ totalFrames, markers }) as unknown as AnimationItem;

describe("resolveFrame", () => {
  it("returns a number specifier as-is", () => {
    expect(resolveFrame(42, makeItem())).toBe(42);
  });

  it("resolves 50% to half of totalFrames", () => {
    expect(resolveFrame("50%", makeItem(100))).toBe(50);
  });

  it("resolves 0% to 0", () => {
    expect(resolveFrame("0%", makeItem(100))).toBe(0);
  });

  it("resolves 100% to totalFrames", () => {
    expect(resolveFrame("100%", makeItem(60))).toBe(60);
  });

  it("rounds percentage results", () => {
    expect(resolveFrame("33%", makeItem(100))).toBe(33);
  });

  it("resolves a named marker to its time", () => {
    const item = makeItem(100, [
      { payload: { name: "intro" }, time: 30 },
      { payload: { name: "outro" }, time: 80 },
    ]);
    expect(resolveFrame("intro", item)).toBe(30);
    expect(resolveFrame("outro", item)).toBe(80);
  });

  it("falls back to parseFloat for unrecognized strings", () => {
    expect(resolveFrame("42", makeItem())).toBe(42);
  });

  it("returns 0 for a non-numeric unrecognized string", () => {
    expect(resolveFrame("missing-marker", makeItem())).toBe(0);
  });
});
