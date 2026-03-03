import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMockAnimationItem } from "../../test/mocks/lottie";
import {
  InteractivityActionType,
  InteractivityMode,
  InteractivityTarget,
  CursorConfig,
} from "../types";

import { useCursorMode } from "./useCursorMode";

import type { MockAnimationItem } from "../../test/mocks/lottie";

const createTarget = (
  container: HTMLDivElement,
  animationItem: MockAnimationItem,
): InteractivityTarget => ({
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

const SEEK_CONFIG: CursorConfig = {
  mode: InteractivityMode.cursor,
  actions: [
    {
      position: { x: [0, 1] },
      type: InteractivityActionType.seek,
    },
  ],
};

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ["requestAnimationFrame", "cancelAnimationFrame"],
  });
  container = document.createElement("div");
  animItem = createMockAnimationItem();
  target = createTarget(container, animItem);
});

afterEach(() => {
  vi.useRealTimers();
});

const fireMoveAt = (x: number, y: number) => {
  // Mock container geometry so normalised position is predictable
  vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  });
  container.dispatchEvent(
    new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true }),
  );
};

describe("useCursorMode", () => {
  it("does not attach listener when disabled", () => {
    renderHook(() => {
      useCursorMode(target, SEEK_CONFIG, false);
    });
    fireMoveAt(50, 50);
    act(() => {
      vi.runAllTimers();
    });
    expect(animItem.goToAndStop).not.toHaveBeenCalled();
  });

  it("calls goToAndStop after mousemove fires and rAF runs (seek action)", () => {
    renderHook(() => {
      useCursorMode(target, SEEK_CONFIG, true);
    });
    fireMoveAt(50, 50);
    act(() => {
      vi.runAllTimers();
    });
    expect(animItem.goToAndStop).toHaveBeenCalled();
  });

  it("calls play() when cursor enters a play-action zone", () => {
    const playConfig: CursorConfig = {
      mode: InteractivityMode.cursor,
      actions: [
        { position: { x: [0, 1] }, type: InteractivityActionType.play },
      ],
    };
    // Simulate animation is paused
    animItem.isPaused = true;
    renderHook(() => {
      useCursorMode(target, playConfig, true);
    });
    fireMoveAt(50, 50);
    act(() => {
      vi.runAllTimers();
    });
    expect(target.play).toHaveBeenCalled();
  });

  it("calls stop() when cursor is in a stop-action zone and animation is playing", () => {
    const stopConfig: CursorConfig = {
      mode: InteractivityMode.cursor,
      actions: [
        { position: { x: [0, 1] }, type: InteractivityActionType.stop },
      ],
    };
    animItem.isPaused = false;
    renderHook(() => {
      useCursorMode(target, stopConfig, true);
    });
    fireMoveAt(50, 50);
    act(() => {
      vi.runAllTimers();
    });
    expect(target.stop).toHaveBeenCalled();
  });

  it("cancels pending rAF on mouseleave", () => {
    renderHook(() => {
      useCursorMode(target, SEEK_CONFIG, true);
    });
    fireMoveAt(50, 50); // queues a rAF
    // mouseleave should cancel before it runs
    container.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    act(() => {
      vi.runAllTimers();
    });
    // goToAndStop should NOT be called (rAF was cancelled)
    expect(animItem.goToAndStop).not.toHaveBeenCalled();
  });

  it("removes listeners on unmount", () => {
    const { unmount } = renderHook(() => {
      useCursorMode(target, SEEK_CONFIG, true);
    });
    unmount();
    fireMoveAt(50, 50);
    act(() => {
      vi.runAllTimers();
    });
    expect(animItem.goToAndStop).not.toHaveBeenCalled();
  });

  it("sets loop=true and plays when cursor enters a loop-action zone", () => {
    const loopConfig: CursorConfig = {
      mode: InteractivityMode.cursor,
      actions: [
        { position: { x: [0, 1] }, type: InteractivityActionType.loop },
      ],
    };
    animItem.isPaused = true;
    renderHook(() => {
      useCursorMode(target, loopConfig, true);
    });
    fireMoveAt(50, 50);
    act(() => {
      vi.runAllTimers();
    });
    expect(animItem.loop).toBe(true);
    expect(target.play).toHaveBeenCalled();
  });

  it("cancels pending rAF on touchend", () => {
    renderHook(() => {
      useCursorMode(target, SEEK_CONFIG, true);
    });
    fireMoveAt(50, 50); // queues rAF
    container.dispatchEvent(new Event("touchend", { bubbles: true }));
    act(() => {
      vi.runAllTimers();
    });
    expect(animItem.goToAndStop).not.toHaveBeenCalled();
  });
});
