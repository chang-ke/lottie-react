import { describe, expect, it } from "vitest";

import normalizeAnimationSource from "./normalizeAnimationSource";

describe("normalizeAnimationSource", () => {
  it("returns { path } for a string URL", () => {
    expect(normalizeAnimationSource("animation.json")).toEqual({ path: "animation.json" });
  });

  it("trims whitespace from string URLs", () => {
    expect(normalizeAnimationSource("  https://example.com/a.json  ")).toEqual({
      path: "https://example.com/a.json",
    });
  });

  it("returns null for an empty string", () => {
    expect(normalizeAnimationSource("")).toBeNull();
  });

  it("returns null for a whitespace-only string", () => {
    expect(normalizeAnimationSource("   ")).toBeNull();
  });

  it("returns { animationData } for a plain object", () => {
    const data = { v: "5.0", layers: [] };
    expect(normalizeAnimationSource(data)).toEqual({ animationData: data });
  });

  it("returns null for an array", () => {
    expect(normalizeAnimationSource([])).toBeNull();
  });

  it("returns null for null", () => {
    expect(normalizeAnimationSource(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(normalizeAnimationSource(undefined)).toBeNull();
  });

  it("returns null for a number", () => {
    expect(normalizeAnimationSource(42)).toBeNull();
  });

  it("accepts .lottie extension URLs", () => {
    expect(normalizeAnimationSource("animation.lottie")).toEqual({ path: "animation.lottie" });
  });

  it("accepts URLs with query strings", () => {
    expect(normalizeAnimationSource("animation.json?v=2")).toEqual({
      path: "animation.json?v=2",
    });
  });
});
