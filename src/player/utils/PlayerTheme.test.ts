import { createElement } from "react";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PLAYER_THEME,
  getButtonColors,
  getResponsiveSize,
  isMobile,
  mergeTheme,
  processLoadingConfig,
} from "./PlayerTheme";

describe("mergeTheme", () => {
  it("returns DEFAULT_PLAYER_THEME when called with no argument", () => {
    expect(mergeTheme()).toEqual(DEFAULT_PLAYER_THEME);
    expect(mergeTheme(undefined)).toEqual(DEFAULT_PLAYER_THEME);
  });

  it("overrides only specified color keys", () => {
    const result = mergeTheme({ colors: { primary: "#f00" } });
    expect(result.colors.primary).toBe("#f00");
    expect(result.colors.accent).toBe(DEFAULT_PLAYER_THEME.colors.accent);
    expect(result.colors.background).toBe(DEFAULT_PLAYER_THEME.colors.background);
  });

  it("overrides only specified sizing keys", () => {
    const result = mergeTheme({ sizing: { buttonSize: 40 } });
    expect(result.sizing.buttonSize).toBe(40);
    expect(result.sizing.height).toBe(DEFAULT_PLAYER_THEME.sizing.height);
  });

  it("overrides effects booleans independently", () => {
    const result = mergeTheme({ effects: { backdropBlur: false } });
    expect(result.effects.backdropBlur).toBe(false);
    expect(result.effects.shadows).toBe(DEFAULT_PLAYER_THEME.effects.shadows);
  });
});

describe("getResponsiveSize", () => {
  it("returns reduced size below breakpoint (80%, min 20)", () => {
    expect(getResponsiveSize(32, 320, 480)).toBe(Math.max(32 * 0.8, 20));
  });

  it("returns 90% size between breakpoint and 1.6x breakpoint", () => {
    expect(getResponsiveSize(32, 600, 480)).toBe(32 * 0.9);
  });

  it("returns full size above 1.6x breakpoint", () => {
    expect(getResponsiveSize(32, 1024, 480)).toBe(32);
  });

  it("clamps to minimum 20px for very small base sizes", () => {
    expect(getResponsiveSize(20, 300, 480)).toBe(20);
    expect(getResponsiveSize(10, 300, 480)).toBe(20);
  });

  it("uses 480 as default breakpoint", () => {
    expect(getResponsiveSize(32, 320)).toBe(Math.max(32 * 0.8, 20));
    expect(getResponsiveSize(32, 1024)).toBe(32);
  });
});

describe("isMobile", () => {
  it("returns true when width is below breakpoint", () => {
    expect(isMobile(320, 480)).toBe(true);
  });

  it("returns false when width equals breakpoint", () => {
    expect(isMobile(480, 480)).toBe(false);
  });

  it("returns false when width is above breakpoint", () => {
    expect(isMobile(1024, 480)).toBe(false);
  });

  it("uses 480 as default breakpoint", () => {
    expect(isMobile(320)).toBe(true);
    expect(isMobile(800)).toBe(false);
  });
});

describe("getButtonColors", () => {
  const theme = DEFAULT_PLAYER_THEME;

  it("returns background color in default state", () => {
    const { backgroundColor } = getButtonColors(theme, {});
    expect(backgroundColor).toBe(theme.colors.background);
  });

  it("returns dimmed colors when disabled", () => {
    const { backgroundColor, iconColor } = getButtonColors(theme, { disabled: true });
    expect(backgroundColor).toContain("20");
    expect(iconColor).toContain("30");
  });

  it("returns accent-tinted background when active", () => {
    const { backgroundColor, iconColor } = getButtonColors(theme, { isActive: true });
    expect(backgroundColor).toBe(`${theme.colors.accent}40`);
    expect(iconColor).toBe(theme.colors.accent);
  });

  it("returns hover background when hovered", () => {
    const { backgroundColor } = getButtonColors(theme, { isHovered: true });
    expect(backgroundColor).toBe(theme.colors.backgroundHover);
  });

  it("primary variant icon uses primary color", () => {
    const { iconColor } = getButtonColors(theme, { variant: "primary" });
    expect(iconColor).toBe(theme.colors.primary);
  });

  it("secondary variant icon uses secondary color", () => {
    const { iconColor } = getButtonColors(theme, { variant: "secondary" });
    expect(iconColor).toBe(theme.colors.secondary);
  });
});

describe("processLoadingConfig", () => {
  it("returns null for null", () => {
    expect(processLoadingConfig(null)).toBeNull();
  });

  it("returns null for false", () => {
    expect(processLoadingConfig(false)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(processLoadingConfig(undefined)).toBeNull();
  });

  it("returns default config for true", () => {
    expect(processLoadingConfig(true)).toEqual({ minDisplayTime: 0, fadeOutTime: 600 });
  });

  it("returns passed config object with defaults for missing keys", () => {
    expect(processLoadingConfig({ fadeOutTime: 300 })).toEqual({
      component: undefined,
      minDisplayTime: 0,
      fadeOutTime: 300,
    });
  });

  it("returns full config when all keys are provided", () => {
    const comp = createElement("div");
    expect(processLoadingConfig({ component: comp, minDisplayTime: 500, fadeOutTime: 200 })).toEqual({
      component: comp,
      minDisplayTime: 500,
      fadeOutTime: 200,
    });
  });

  it("wraps a ReactNode in a config with defaults", () => {
    const node = createElement("span");
    const result = processLoadingConfig(node);
    expect(result?.component).toBe(node);
    expect(result?.minDisplayTime).toBe(0);
    expect(result?.fadeOutTime).toBe(600);
  });
});
