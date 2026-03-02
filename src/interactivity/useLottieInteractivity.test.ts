import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MockIntersectionObserver } from "../test/mocks/intersectionObserver";
import { createMockAnimationItem } from "../test/mocks/lottie";

import { ChainTransitionType, InteractivityActionType, InteractivityMode, InteractivityTarget } from "./types";
import { useLottieInteractivity } from "./useLottieInteractivity";

const createTarget = (container: HTMLDivElement): InteractivityTarget => ({
  containerRef: { current: container } as React.RefObject<HTMLDivElement>,
  animationItem: createMockAnimationItem(),
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  subscribe: vi.fn().mockReturnValue(vi.fn()),
  totalFrames: 100,
  changeDirection: vi.fn(),
});

let container: HTMLDivElement;
let target: InteractivityTarget;
const HOVER_CONFIG = { mode: InteractivityMode.hover } as const;

beforeEach(() => {
  // Stub IntersectionObserver since scroll mode is always mounted (Rules of Hooks)
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  MockIntersectionObserver.reset();
  container = document.createElement("div");
  target = createTarget(container);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useLottieInteractivity", () => {
  it("starts with isActive=true", () => {
    const { result } = renderHook(() =>
      useLottieInteractivity(target, HOVER_CONFIG),
    );
    expect(result.current.isActive).toBe(true);
  });

  it("disable() sets isActive to false", () => {
    const { result } = renderHook(() =>
      useLottieInteractivity(target, HOVER_CONFIG),
    );
    act(() => { result.current.disable(); });
    expect(result.current.isActive).toBe(false);
  });

  it("enable() restores isActive to true after disable", () => {
    const { result } = renderHook(() =>
      useLottieInteractivity(target, HOVER_CONFIG),
    );
    act(() => { result.current.disable(); });
    act(() => { result.current.enable(); });
    expect(result.current.isActive).toBe(true);
  });

  it("disabled mode does not respond to mouseenter", () => {
    const { result } = renderHook(() =>
      useLottieInteractivity(target, HOVER_CONFIG),
    );
    act(() => { result.current.disable(); });
    act(() => {
      container.dispatchEvent(new Event("mouseenter", { bubbles: true }));
    });
    expect(target.play).not.toHaveBeenCalled();
  });

  it("activates scroll mode when config.mode is scroll (covers isScroll true branch)", () => {
    const scrollConfig = { mode: InteractivityMode.scroll, actions: [] as never[] };
    const { result } = renderHook(() =>
      useLottieInteractivity(target, scrollConfig),
    );
    expect(result.current.isActive).toBe(true);
  });

  it("activates cursor mode when config.mode is cursor (covers isCursor true branch)", () => {
    const cursorConfig = { mode: InteractivityMode.cursor, actions: [] as never[] };
    const { result } = renderHook(() =>
      useLottieInteractivity(target, cursorConfig),
    );
    expect(result.current.isActive).toBe(true);
  });

  it("activates click mode when config.mode is click (covers isClick true branch)", () => {
    const clickConfig = { mode: InteractivityMode.click, type: InteractivityActionType.play };
    const { result } = renderHook(() =>
      useLottieInteractivity(target, clickConfig),
    );
    expect(result.current.isActive).toBe(true);
  });

  it("exposes currentChainState and goToChainState", () => {
    const chainConfig = {
      mode: InteractivityMode.chain,
      states: [
        {
          name: "idle",
          type: InteractivityActionType.play,
          transition: { type: ChainTransitionType.none },
        },
      ],
    };
    const { result } = renderHook(() =>
      useLottieInteractivity(target, chainConfig),
    );
    expect(result.current).toHaveProperty("currentChainState");
    expect(result.current).toHaveProperty("goToChainState");
  });
});
