import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useFade } from "./useFade";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useFade", () => {
  it("starts visible when shouldShow is true", () => {
    const { result } = renderHook(() => useFade({ shouldShow: true }));
    expect(result.current.isVisible).toBe(true);
  });

  it("starts hidden when shouldShow is false", () => {
    const { result } = renderHook(() => useFade({ shouldShow: false }));
    expect(result.current.isVisible).toBe(false);
  });

  it("becomes visible when shouldShow transitions to true", () => {
    const { result, rerender } = renderHook(
      ({ show }) => useFade({ shouldShow: show }),
      { initialProps: { show: false } },
    );
    rerender({ show: true });
    expect(result.current.isVisible).toBe(true);
  });

  it("hides immediately when shouldShow→false with no fadeOutTime", () => {
    const { result, rerender } = renderHook(
      ({ show }) => useFade({ shouldShow: show, fadeOutTime: null }),
      { initialProps: { show: true } },
    );
    rerender({ show: false });
    expect(result.current.isVisible).toBe(false);
  });

  it("minimumDisplayTime delays hiding after shouldShow→false", () => {
    const { result, rerender } = renderHook(
      ({ show }) =>
        useFade({
          shouldShow: show,
          minimumDisplayTime: 500,
          fadeOutTime: null,
        }),
      { initialProps: { show: true } },
    );
    rerender({ show: false });
    // Not yet hidden — minimum display time hasn't elapsed
    expect(result.current.isVisible).toBe(true);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.isVisible).toBe(false);
  });

  it("starts fadeOut animation when fadeOutTime is set and shouldShow→false", () => {
    const { result, rerender } = renderHook(
      ({ show }) => useFade({ shouldShow: show, fadeOutTime: 300 }),
      { initialProps: { show: true } },
    );
    rerender({ show: false });
    // Still visible but fading — animationName is set
    expect(result.current.isVisible).toBe(true);
    expect(result.current.fadeProps.style).toMatchObject({
      animationName: "player-overlay-fade-out",
    });
  });

  it("hides when onAnimationEnd fires with the fade animationName", () => {
    const { result, rerender } = renderHook(
      ({ show }) => useFade({ shouldShow: show, fadeOutTime: 300 }),
      { initialProps: { show: true } },
    );
    rerender({ show: false });
    act(() => {
      result.current.fadeProps.onAnimationEnd({
        animationName: "player-overlay-fade-out",
      });
    });
    expect(result.current.isVisible).toBe(false);
  });

  it("ignores onAnimationEnd with a different animationName", () => {
    const { result, rerender } = renderHook(
      ({ show }) => useFade({ shouldShow: show, fadeOutTime: 300 }),
      { initialProps: { show: true } },
    );
    rerender({ show: false });
    act(() => {
      result.current.fadeProps.onAnimationEnd({
        animationName: "other-animation",
      });
    });
    expect(result.current.isVisible).toBe(true);
  });
});
