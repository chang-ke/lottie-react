import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockAnimationItem } from "../../test/mocks/lottie";
import { Direction } from "../../types";
import { InteractivityActionType, InteractivityMode, InteractivityTarget } from "../types";

import { useHoverMode } from "./useHoverMode";

import type { MockAnimationItem } from "../../test/mocks/lottie";

const createTarget = (container: HTMLDivElement, animationItem: MockAnimationItem): InteractivityTarget => ({
  containerRef: { current: container } as React.RefObject<HTMLDivElement>,
  animationItem,
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  subscribe: vi.fn().mockReturnValue(vi.fn()),
  totalFrames: 100,
  changeDirection: vi.fn(),
});

let container: HTMLDivElement;
let animItem: MockAnimationItem;
let target: InteractivityTarget;

const CONFIG = { mode: InteractivityMode.hover } as const;

beforeEach(() => {
  container = document.createElement("div");
  animItem = createMockAnimationItem();
  target = createTarget(container, animItem);
});

const dispatch = (type: string) => {
  container.dispatchEvent(new Event(type, { bubbles: true }));
};

describe("useHoverMode", () => {
  it("does not attach listeners when disabled", () => {
    renderHook(() => { useHoverMode(target, CONFIG, false); });
    dispatch("mouseenter");
    expect(target.play).not.toHaveBeenCalled();
  });

  it("calls play() on mouseenter by default", () => {
    renderHook(() => { useHoverMode(target, CONFIG, true); });
    act(() => { dispatch("mouseenter"); });
    expect(target.play).toHaveBeenCalledOnce();
  });

  it("calls stop() on mouseleave by default", () => {
    renderHook(() => { useHoverMode(target, CONFIG, true); });
    act(() => { dispatch("mouseenter"); });
    act(() => { dispatch("mouseleave"); });
    expect(target.stop).toHaveBeenCalledOnce();
  });

  it("calls stop() on enter when onEnter is 'stop'", () => {
    renderHook(() => {
      useHoverMode(target, { ...CONFIG, onEnter: InteractivityActionType.stop }, true);
    });
    act(() => { dispatch("mouseenter"); });
    expect(target.stop).toHaveBeenCalledOnce();
    expect(target.play).not.toHaveBeenCalled();
  });

  it("calls play() on leave when onLeave is 'play'", () => {
    renderHook(() => {
      useHoverMode(target, { ...CONFIG, onLeave: InteractivityActionType.play }, true);
    });
    act(() => { dispatch("mouseenter"); });
    vi.mocked(target.play).mockClear();
    act(() => { dispatch("mouseleave"); });
    expect(target.play).toHaveBeenCalledOnce();
  });

  it("calls goToAndPlay with seek frame on mouseenter when onEnter=seek+frames", () => {
    renderHook(() => {
      useHoverMode(target, { ...CONFIG, onEnter: InteractivityActionType.seek, frames: [10, 50] }, true);
    });
    act(() => { dispatch("mouseenter"); });
    expect(animItem.goToAndPlay).toHaveBeenCalledWith(10, true);
  });

  it("calls playSegments on mouseenter when onEnter=play+frames", () => {
    renderHook(() => {
      useHoverMode(target, { ...CONFIG, onEnter: InteractivityActionType.play, frames: [5, 40] }, true);
    });
    act(() => { dispatch("mouseenter"); });
    expect(animItem.playSegments).toHaveBeenCalledWith([5, 40], true);
  });

  it("reverseOnLeave changes direction to left and calls play() on leave", () => {
    renderHook(() => {
      useHoverMode(target, { ...CONFIG, reverseOnLeave: true }, true);
    });
    act(() => { dispatch("mouseleave"); });
    expect(target.changeDirection).toHaveBeenCalledWith(Direction.left);
    expect(target.play).toHaveBeenCalledOnce();
  });

  it("reverseOnLeave: fires stop and restores forward direction when complete event fires", () => {
    renderHook(() => {
      useHoverMode(target, { ...CONFIG, reverseOnLeave: true }, true);
    });
    act(() => { dispatch("mouseleave"); });

    // Fire the complete subscription callback registered during reverseOnLeave
    const subscribeCalls = vi.mocked(target.subscribe).mock.calls;
    const completeCallback = subscribeCalls.at(0)?.[1];
    act(() => { completeCallback?.(undefined as never); });

    expect(target.stop).toHaveBeenCalled();
    expect(target.changeDirection).toHaveBeenCalledWith(Direction.right);
  });

  it("cancels pending frame watcher on mouseenter if reverseOnLeave was active", () => {
    const unsubscribe = vi.fn();
    vi.mocked(target.subscribe).mockReturnValue(unsubscribe);

    renderHook(() => {
      useHoverMode(target, { ...CONFIG, reverseOnLeave: true }, true);
    });
    act(() => { dispatch("mouseleave"); }); // sets unsubscribeFrame
    act(() => { dispatch("mouseenter"); }); // should cancel it
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("removes event listeners on unmount", () => {
    const { unmount } = renderHook(() => {
      useHoverMode(target, CONFIG, true);
    });
    unmount();
    act(() => { dispatch("mouseenter"); });
    expect(target.play).not.toHaveBeenCalled();
  });

  it("responds to touchstart like mouseenter", () => {
    renderHook(() => { useHoverMode(target, CONFIG, true); });
    act(() => { container.dispatchEvent(new Event("touchstart", { bubbles: true })); });
    expect(target.play).toHaveBeenCalledOnce();
  });

  it("responds to touchend like mouseleave", () => {
    renderHook(() => { useHoverMode(target, CONFIG, true); });
    act(() => { dispatch("mouseenter"); });
    vi.mocked(target.stop).mockClear();
    act(() => { container.dispatchEvent(new Event("touchend", { bubbles: true })); });
    expect(target.stop).toHaveBeenCalledOnce();
  });
});
