import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createMockAnimationItem } from "../../test/mocks/lottie";
import {
  InteractivityActionType,
  InteractivityMode,
  InteractivityTarget,
} from "../types";

import { useClickMode } from "./useClickMode";

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

beforeEach(() => {
  container = document.createElement("div");
  animItem = createMockAnimationItem();
  target = createTarget(container, animItem);
});

const click = () => {
  act(() => {
    container.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
};

describe("useClickMode", () => {
  it("does not attach listener when disabled", () => {
    renderHook(() => {
      useClickMode(
        target,
        { mode: InteractivityMode.click, type: InteractivityActionType.play },
        false,
      );
    });
    click();
    expect(target.play).not.toHaveBeenCalled();
  });

  it("click with type=play calls play()", () => {
    renderHook(() => {
      useClickMode(
        target,
        { mode: InteractivityMode.click, type: InteractivityActionType.play },
        true,
      );
    });
    click();
    expect(target.play).toHaveBeenCalledOnce();
  });

  it("click with type=stop calls stop()", () => {
    renderHook(() => {
      useClickMode(
        target,
        { mode: InteractivityMode.click, type: InteractivityActionType.stop },
        true,
      );
    });
    click();
    expect(target.stop).toHaveBeenCalledOnce();
  });

  it("toggle: first click plays, second click pauses", () => {
    renderHook(() => {
      useClickMode(
        target,
        {
          mode: InteractivityMode.click,
          type: InteractivityActionType.play,
          toggle: true,
        },
        true,
      );
    });
    click();
    expect(target.play).toHaveBeenCalledOnce();
    expect(target.pause).not.toHaveBeenCalled();

    click();
    expect(target.pause).toHaveBeenCalledOnce();
  });

  it("count limit: ignores clicks after N plays", () => {
    // subscribe mock — complete subscription returns unsubscribe fn
    const unsub = vi.fn();
    vi.mocked(target.subscribe).mockReturnValue(unsub);

    renderHook(() => {
      useClickMode(
        target,
        {
          mode: InteractivityMode.click,
          type: InteractivityActionType.play,
          count: 1,
        },
        true,
      );
    });

    click(); // count = 0, should play
    expect(target.play).toHaveBeenCalledOnce();

    // Simulate complete event firing by calling the subscriber's callback
    const subscribeCalls = vi.mocked(target.subscribe).mock.calls;
    const completeCallback = subscribeCalls.at(0)?.[1];
    if (completeCallback)
      act(() => {
        completeCallback(undefined as never);
      });

    // Now count = 1 = count limit, next click should be ignored
    vi.mocked(target.play).mockClear();
    click();
    expect(target.play).not.toHaveBeenCalled();
  });

  it("seek action: navigates to resolved frame on click", () => {
    renderHook(() => {
      useClickMode(
        target,
        {
          mode: InteractivityMode.click,
          type: InteractivityActionType.seek,
          frames: [10, 50],
        },
        true,
      );
    });
    click();
    expect(animItem.goToAndPlay).toHaveBeenCalledWith(10, true);
  });

  it("playSegments action: plays from startFrame to endFrame on click", () => {
    renderHook(() => {
      useClickMode(
        target,
        {
          mode: InteractivityMode.click,
          type: InteractivityActionType.playSegments,
          frames: [5, 30],
        },
        true,
      );
    });
    click();
    expect(animItem.goToAndPlay).toHaveBeenCalledWith(5, true);
  });

  it("playSegments action: stops at endFrame when frame subscription fires", () => {
    const unsub = vi.fn();
    vi.mocked(target.subscribe).mockReturnValue(unsub);

    renderHook(() => {
      useClickMode(
        target,
        {
          mode: InteractivityMode.click,
          type: InteractivityActionType.playSegments,
          frames: [5, 30],
        },
        true,
      );
    });
    click(); // triggers goToAndPlay and subscribes to frame

    // Simulate the frame event reaching endFrame
    const subscribeCalls = vi.mocked(target.subscribe).mock.calls;
    const frameCallback = subscribeCalls.at(0)?.[1];
    act(() => {
      frameCallback?.({ currentFrame: 30 } as never);
    });

    expect(animItem.goToAndStop).toHaveBeenCalledWith(30, true);
    expect(unsub).toHaveBeenCalled(); // unsubscribed after reaching end
  });

  it("removes listener on unmount", () => {
    const { unmount } = renderHook(() => {
      useClickMode(
        target,
        { mode: InteractivityMode.click, type: InteractivityActionType.play },
        true,
      );
    });
    unmount();
    click();
    expect(target.play).not.toHaveBeenCalled();
  });

  it("cleans up active subscription on unmount", () => {
    const unsub = vi.fn();
    vi.mocked(target.subscribe).mockReturnValue(unsub);

    const { unmount } = renderHook(() => {
      useClickMode(
        target,
        {
          mode: InteractivityMode.click,
          type: InteractivityActionType.play,
          count: 2,
        },
        true,
      );
    });
    click(); // creates subscription

    unmount(); // should call unsubscribe
    expect(unsub).toHaveBeenCalled();
  });
});
