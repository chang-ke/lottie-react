import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMockAnimationItem } from "../../test/mocks/lottie";
import { LottieSubscription } from "../../types";
import {
  ChainTransitionType,
  InteractivityActionType,
  InteractivityMode,
  InteractivityTarget,
} from "../types";

import { useChainMode } from "./useChainMode";

import type { MockAnimationItem } from "../../test/mocks/lottie";
import type { ChainConfig } from "../types";

// ── Factory helpers ───────────────────────────────────────────────────────────

interface TargetSetup {
  target: InteractivityTarget;
  /** Fire a named subscription event (calls all registered callbacks). */
  fireSubscription: (event: string) => void;
}

const createTarget = (
  container: HTMLDivElement,
  animationItem: MockAnimationItem,
): TargetSetup => {
  const listeners = new Map<string, ((...args: never[]) => void)[]>();
  const subscribe = vi.fn().mockImplementation(
    (event: string, cb: (...args: never[]) => void) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event)?.push(cb);
      return () => {
        const arr = listeners.get(event);
        if (arr) listeners.set(event, arr.filter((fn) => fn !== cb));
      };
    },
  );

  const target: InteractivityTarget = {
    containerRef: { current: container } as React.RefObject<HTMLDivElement>,
    animationItem,
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    subscribe,
    totalFrames: 100,
    changeDirection: vi.fn(),
  };

  const fireSubscription = (event: string) => {
    listeners.get(event)?.forEach((cb) => { cb(); });
  };

  return { target, fireSubscription };
};

// Config helpers
const onCompleteConfig = (name = "state1"): ChainConfig => ({
  mode: InteractivityMode.chain,
  states: [{ name, type: InteractivityActionType.play, transition: { type: ChainTransitionType.onComplete } }],
});

// ── Module-level fixtures ─────────────────────────────────────────────────────

let container: HTMLDivElement;
let animItem: MockAnimationItem;
let target: InteractivityTarget;
let fireSubscription: (event: string) => void;

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  animItem = createMockAnimationItem();
  const setup = createTarget(container, animItem);
  target = setup.target;
  fireSubscription = setup.fireSubscription;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useChainMode — disabled", () => {
  it("does not enter any state when disabled=false", () => {
    renderHook(() => { useChainMode(target, onCompleteConfig(), false); });
    expect(target.play).not.toHaveBeenCalled();
  });
});

describe("useChainMode — initial state", () => {
  it("enters the first state on mount", () => {
    renderHook(() => { useChainMode(target, onCompleteConfig(), true); });
    expect(target.play).toHaveBeenCalled();
  });

  it("uses initialState from config when specified", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "first", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
        { name: "second", type: InteractivityActionType.play, transition: { type: ChainTransitionType.none } },
      ],
      initialState: "second",
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(target.play).toHaveBeenCalled();
    expect(target.stop).not.toHaveBeenCalled();
  });

  it("exposes currentChainState and goToChainState", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.none } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));
    expect(result.current.currentChainState).toBe("a");

    act(() => { result.current.goToChainState("b"); });
    expect(result.current.currentChainState).toBe("b");
  });
});

describe("useChainMode — action types", () => {
  it("calls stop() for stop action type", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [{ name: "s", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } }],
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(target.stop).toHaveBeenCalled();
  });

  it("calls goToAndStop for seek action type", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [{ name: "s", type: InteractivityActionType.seek, frames: [10, 50], transition: { type: ChainTransitionType.none } }],
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(animItem.goToAndStop).toHaveBeenCalledWith(10, true);
  });

  it("calls playSegments for play action with frames", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [{ name: "s", type: InteractivityActionType.play, frames: [0, 50], transition: { type: ChainTransitionType.none } }],
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(animItem.playSegments).toHaveBeenCalledWith([0, 50], true);
  });

  it("sets loop=true for loop action type", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [{ name: "s", type: InteractivityActionType.loop, transition: { type: ChainTransitionType.none } }],
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(animItem.loop).toBe(true);
    expect(target.play).toHaveBeenCalled();
  });

  it("applies setSpeed when speed is set on state", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [{ name: "s", type: InteractivityActionType.play, speed: 2, transition: { type: ChainTransitionType.none } }],
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(animItem.setSpeed).toHaveBeenCalledWith(2);
  });

  it("calls goToAndStop with start frame when forceFlag is set", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [{ name: "s", type: InteractivityActionType.play, frames: [20, 80], forceFlag: true, transition: { type: ChainTransitionType.none } }],
    };
    renderHook(() => { useChainMode(target, config, true); });
    expect(animItem.goToAndStop).toHaveBeenCalledWith(20, true);
  });
});

describe("useChainMode — transition: onComplete", () => {
  it("advances to next state when complete subscription fires", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.onComplete } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));
    expect(result.current.currentChainState).toBe("a");

    act(() => { fireSubscription(LottieSubscription.complete); });

    expect(result.current.currentChainState).toBe("b");
    expect(target.stop).toHaveBeenCalled();
  });
});

describe("useChainMode — transition: click", () => {
  it("advances on container click", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.click } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));

    act(() => { container.dispatchEvent(new MouseEvent("click", { bubbles: true })); });

    expect(result.current.currentChainState).toBe("b");
  });

  it("requires N clicks when count is set", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.click, count: 2 } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));

    act(() => { container.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
    expect(result.current.currentChainState).toBe("a"); // not yet

    act(() => { container.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
    expect(result.current.currentChainState).toBe("b");
  });
});

describe("useChainMode — transition: hover", () => {
  it("advances on mouseenter", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.hover } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));

    act(() => { container.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true })); });

    expect(result.current.currentChainState).toBe("b");
  });
});

describe("useChainMode — transition: delay", () => {
  it("advances after the specified delay", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.delay, delay: 500 } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));
    expect(result.current.currentChainState).toBe("a");

    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current.currentChainState).toBe("b");
  });
});

describe("useChainMode — transition: repeat", () => {
  it("advances after N loopCompleted events", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.loop, transition: { type: ChainTransitionType.repeat, count: 2 } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));

    act(() => { fireSubscription(LottieSubscription.loopCompleted); });
    expect(result.current.currentChainState).toBe("a"); // not yet

    act(() => { fireSubscription(LottieSubscription.loopCompleted); });
    expect(result.current.currentChainState).toBe("b");
  });
});

describe("useChainMode — transition: hold", () => {
  it("plays on mousedown and pauses on mouseup", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.hold } },
      ],
    };
    renderHook(() => { useChainMode(target, config, true); });

    act(() => { container.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); });
    expect(target.play).toHaveBeenCalled();

    act(() => { container.dispatchEvent(new MouseEvent("mouseup", { bubbles: true })); });
    expect(target.pause).toHaveBeenCalled();
  });
});

describe("useChainMode — transition: pauseHold", () => {
  it("pauses on mousedown and plays on mouseup", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.pauseHold } },
      ],
    };
    renderHook(() => { useChainMode(target, config, true); });
    vi.mocked(target.play).mockClear();

    act(() => { container.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); });
    expect(target.pause).toHaveBeenCalled();

    act(() => { container.dispatchEvent(new MouseEvent("mouseup", { bubbles: true })); });
    expect(target.play).toHaveBeenCalled();
  });
});

describe("useChainMode — transition: cursorSync", () => {
  it("calls goToAndStop on mousemove based on cursor x position", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.seek, frames: [0, 100], transition: { type: ChainTransitionType.cursorSync } },
      ],
    };
    renderHook(() => { useChainMode(target, config, true); });

    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      left: 0, top: 0, width: 200, height: 100,
      right: 200, bottom: 100, x: 0, y: 0, toJSON: vi.fn(),
    });

    act(() => {
      container.dispatchEvent(new MouseEvent("mousemove", { clientX: 100, clientY: 50, bubbles: true }));
    });

    // x=100 of width=200 → normalized x=0.5 → frame = 0 + 0.5*(100-0) = 50
    expect(animItem.goToAndStop).toHaveBeenCalledWith(50, true);
  });
});

describe("useChainMode — transition: none", () => {
  it("stays in the state indefinitely (no automatic advance)", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.none } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));
    act(() => { vi.runAllTimers(); });
    expect(result.current.currentChainState).toBe("a");
  });
});

describe("useChainMode — loop wrap", () => {
  it("wraps back to first state when loop=true and last state completes", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      loop: true,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.onComplete } },
        { name: "b", type: InteractivityActionType.play, transition: { type: ChainTransitionType.onComplete } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));
    expect(result.current.currentChainState).toBe("a");

    act(() => { fireSubscription(LottieSubscription.complete); }); // a → b
    expect(result.current.currentChainState).toBe("b");

    act(() => { fireSubscription(LottieSubscription.complete); }); // b → a (loop)
    expect(result.current.currentChainState).toBe("a");
  });
});

describe("useChainMode — transition target", () => {
  it("jumps to named target state instead of sequential next", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.onComplete, target: "c" } },
        { name: "b", type: InteractivityActionType.play, transition: { type: ChainTransitionType.none } },
        { name: "c", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, true));

    act(() => { fireSubscription(LottieSubscription.complete); });

    expect(result.current.currentChainState).toBe("c");
  });
});

describe("useChainMode — cleanup on unmount", () => {
  it("removes event listeners on unmount", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.click } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result, unmount } = renderHook(() => useChainMode(target, config, true));

    unmount();

    act(() => { container.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
    expect(result.current.currentChainState).toBe("a");
  });

  it("cancels pending delay timer on unmount", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.delay, delay: 500 } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result, unmount } = renderHook(() => useChainMode(target, config, true));

    unmount();
    act(() => { vi.advanceTimersByTime(600); });

    expect(result.current.currentChainState).toBe("a");
  });
});

describe("useChainMode — goToChainState disabled", () => {
  it("does not change state when disabled", () => {
    const config: ChainConfig = {
      mode: InteractivityMode.chain,
      states: [
        { name: "a", type: InteractivityActionType.play, transition: { type: ChainTransitionType.none } },
        { name: "b", type: InteractivityActionType.stop, transition: { type: ChainTransitionType.none } },
      ],
    };
    const { result } = renderHook(() => useChainMode(target, config, false));

    act(() => { result.current.goToChainState("b"); });
    expect(target.stop).not.toHaveBeenCalled();
  });
});
