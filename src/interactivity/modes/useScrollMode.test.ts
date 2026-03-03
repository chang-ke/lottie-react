import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MockIntersectionObserver } from "../../test/mocks/intersectionObserver";
import { createMockAnimationItem } from "../../test/mocks/lottie";
import {
  InteractivityActionType,
  InteractivityMode,
  InteractivityTarget,
  ScrollConfig,
} from "../types";

import { useScrollMode } from "./useScrollMode";

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
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  MockIntersectionObserver.reset();
  container = document.createElement("div");
  animItem = createMockAnimationItem();
  target = createTarget(container, animItem);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const SEEK_CONFIG: ScrollConfig = {
  mode: InteractivityMode.scroll,
  actions: [{ visibility: [0, 1], type: InteractivityActionType.seek }],
};

describe("useScrollMode", () => {
  it("does not create observer when disabled", () => {
    renderHook(() => {
      useScrollMode(target, SEEK_CONFIG, false);
    });
    expect(MockIntersectionObserver.getLast()).toBeUndefined();
  });

  it("creates an IntersectionObserver and observes the container", () => {
    renderHook(() => {
      useScrollMode(target, SEEK_CONFIG, true);
    });
    const observer = MockIntersectionObserver.getLast();
    expect(observer).toBeDefined();
    expect(observer?.observed.has(container)).toBe(true);
  });

  it("adds scroll listener to window when element intersects", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => {
      useScrollMode(target, SEEK_CONFIG, true);
    });

    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });

    expect(addSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      expect.any(Object),
    );
    addSpy.mockRestore();
  });

  it("calls goToAndStop when scroll fires (seek action)", () => {
    // Set up predictable geometry: element bottom at viewport center
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 600,
      height: 100,
      width: 200,
      left: 0,
      right: 200,
      x: 0,
      y: 500,
      toJSON: vi.fn(),
    });
    vi.stubGlobal("innerHeight", 1000);

    renderHook(() => {
      useScrollMode(target, SEEK_CONFIG, true);
    });

    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    }); // adds scroll listener + calls handleScroll

    // handleScroll is called synchronously on intersection
    expect(animItem.goToAndStop).toHaveBeenCalled();
  });

  it("disconnects observer and removes scroll listener on unmount", () => {
    const { unmount } = renderHook(() => {
      useScrollMode(target, SEEK_CONFIG, true);
    });

    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });

    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("calls play() when element intersects with play action and animation is paused", () => {
    const playConfig: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.play }],
    };
    animItem.isPaused = true;

    renderHook(() => {
      useScrollMode(target, playConfig, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });

    expect(target.play).toHaveBeenCalled();
  });

  it("calls stop() when element intersects with stop action and animation is playing", () => {
    const stopConfig: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.stop }],
    };
    animItem.isPaused = false;

    renderHook(() => {
      useScrollMode(target, stopConfig, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });

    expect(target.stop).toHaveBeenCalled();
  });

  it("removes scroll listener when element leaves viewport", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    renderHook(() => {
      useScrollMode(target, SEEK_CONFIG, true);
    });

    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    }); // enter
    act(() => {
      observer.trigger(container, false);
    }); // leave

    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    removeSpy.mockRestore();
  });

  it("calls goToAndPlay(0) for playOnce action without frames", () => {
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.playOnce }],
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    expect(animItem.goToAndPlay).toHaveBeenCalledWith(0, true);
  });

  it("calls playSegments for playOnce action with frames", () => {
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [
        {
          visibility: [0, 1],
          type: InteractivityActionType.playOnce,
          frames: [10, 50],
        },
      ],
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    expect(animItem.playSegments).toHaveBeenCalledWith([10, 50], true);
  });

  it("does not re-fire playOnce after it already played", () => {
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.playOnce }],
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    }); // first intersection
    animItem.goToAndPlay.mockClear();
    // Trigger scroll to call handleScroll again
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(animItem.goToAndPlay).not.toHaveBeenCalled();
  });

  it("sets loop=true and calls play() for loop action", () => {
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.loop }],
    };
    animItem.isPaused = true;
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    expect(animItem.loop).toBe(true);
    expect(target.play).toHaveBeenCalled();
  });

  it("calls playSegments for playSegments action type", () => {
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [
        {
          visibility: [0, 1],
          type: InteractivityActionType.playSegments,
          frames: [0, 50],
        },
      ],
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    expect(animItem.playSegments).toHaveBeenCalledWith([0, 50], true);
  });

  it("uses HTMLElement scroll container (computeScrollProgress HTMLElement branch)", () => {
    const scrollContainer = document.createElement("div");
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.seek }],
      container: scrollContainer,
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    // goToAndStop called — progress computed via HTMLElement container path
    expect(animItem.goToAndStop).toHaveBeenCalled();
  });

  it("uses 'self' as scroll container", () => {
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 600,
      height: 100,
      width: 200,
      left: 0,
      right: 200,
      x: 0,
      y: 500,
      toJSON: vi.fn(),
    });
    vi.stubGlobal("innerHeight", 1000);
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.seek }],
      container: "self",
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    expect(animItem.goToAndStop).toHaveBeenCalled();
  });

  it("uses RefObject scroll container (falls back to window when current is null)", () => {
    const scrollRef: { current: HTMLElement | null } = { current: null };
    vi.spyOn(container, "getBoundingClientRect").mockReturnValue({
      top: 500,
      bottom: 600,
      height: 100,
      width: 200,
      left: 0,
      right: 200,
      x: 0,
      y: 500,
      toJSON: vi.fn(),
    });
    vi.stubGlobal("innerHeight", 1000);
    const config: ScrollConfig = {
      mode: InteractivityMode.scroll,
      actions: [{ visibility: [0, 1], type: InteractivityActionType.seek }],
      container: scrollRef,
    };
    renderHook(() => {
      useScrollMode(target, config, true);
    });
    const observer = MockIntersectionObserver.getLastOrFail();
    act(() => {
      observer.trigger(container, true);
    });
    expect(animItem.goToAndStop).toHaveBeenCalled();
  });
});
