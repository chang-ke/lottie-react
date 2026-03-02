import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createMockAnimationItem, createMockLottie } from "../test/mocks/lottie";
import { Direction, LottieState, LottieSubscription } from "../types";

import { useLottieFactory } from "./useLottieFactory";

import type { LottiePlayer } from "lottie-web";

// Stable src reference — MUST be defined outside renderHook callbacks.
// An inline `{ v: "5.0" }` inside the render function creates a new object on
// every render, making the src dep in useLottieFactory's useEffect change each
// render → loadAnimation re-runs → setAnimationItem → re-render → infinite loop.
const SRC = { v: "5.0" } as const;

/** Renders the hook with a mock lottie player. */
const setup = (
  options: Parameters<typeof useLottieFactory>[1] = { src: SRC },
) => {
  const mockItem = createMockAnimationItem();
  const mockLottie = createMockLottie(mockItem);
  const hook = renderHook(() => useLottieFactory(mockLottie as unknown as LottiePlayer, options));

  act(() => {
    hook.result.current.setContainerRef(document.createElement("div"));
  });

  return { hook, mockItem, mockLottie };
};

/** Fires the DOMLoaded event so the hook transitions out of loading state. */
const fireLoaded = (mockItem: ReturnType<typeof createMockAnimationItem>) => {
  act(() => {
    mockItem._fireEvent("DOMLoaded");
  });
};

// ─── Initialization ─────────────────────────────────────────────────────────

describe("useLottieFactory — initialization", () => {
  it("starts in loading state", () => {
    const { hook } = setup();
    expect(hook.result.current.state).toBe(LottieState.loading);
  });

  it("calls loadAnimation after container is attached", () => {
    const { mockLottie } = setup();
    expect(mockLottie.loadAnimation).toHaveBeenCalled();
  });

  it("passes animationData when src is an object", () => {
    const data = { v: "5.0", layers: [] };
    const { mockLottie } = setup({ src: data });
    expect(mockLottie.loadAnimation).toHaveBeenCalledWith(
      expect.objectContaining({ animationData: data }),
    );
  });

  it("passes path when src is a string URL", () => {
    const { mockLottie } = setup({ src: "https://example.com/anim.json" });
    expect(mockLottie.loadAnimation).toHaveBeenCalledWith(
      expect.objectContaining({ path: "https://example.com/anim.json" }),
    );
  });

  it("transitions to stopped after DOMLoaded with autoplay=false", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    expect(hook.result.current.state).toBe(LottieState.stopped);
  });

  it("transitions to playing after DOMLoaded with autoplay=true", () => {
    const mockItem = createMockAnimationItem({ autoplay: true });
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(() => useLottieFactory(mockLottie as unknown as LottiePlayer, { src: SRC }));
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);
    expect(hook.result.current.state).toBe(LottieState.playing);
  });

  it("transitions to failure for an invalid src", () => {
    const { hook } = setup({ src: "" });
    expect(hook.result.current.state).toBe(LottieState.failure);
  });

  it("transitions to failure when loadAnimation throws", () => {
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    mockLottie.loadAnimation.mockImplementation(() => {
      throw new Error("load failed");
    });
    const hook = renderHook(() => useLottieFactory(mockLottie as unknown as LottiePlayer, { src: SRC }));
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    expect(hook.result.current.state).toBe(LottieState.failure);
  });
});

// ─── Events ─────────────────────────────────────────────────────────────────

describe("useLottieFactory — events", () => {
  it("transitions to failure on data_failed", () => {
    const { hook, mockItem } = setup();
    act(() => {
      mockItem._fireEvent("data_failed");
    });
    expect(hook.result.current.state).toBe(LottieState.failure);
  });

  it("fires the ready subscription on data_ready", () => {
    const onReady = vi.fn();
    const { mockItem } = setup({
      src: SRC,
      subscriptions: { [LottieSubscription.ready]: onReady },
    });
    act(() => {
      mockItem._fireEvent("data_ready");
    });
    expect(onReady).toHaveBeenCalledOnce();
  });

  it("fires the frame subscription on enterFrame", () => {
    const onFrame = vi.fn();
    const { mockItem } = setup({
      src: SRC,
      subscriptions: { [LottieSubscription.frame]: onFrame },
    });
    fireLoaded(mockItem);
    act(() => {
      mockItem._fireEvent("enterFrame");
    });
    expect(onFrame).toHaveBeenCalledWith({
      currentFrame: mockItem.currentFrame,
    });
  });

  it("fires the complete subscription and resets to stopped on complete", () => {
    const onComplete = vi.fn();
    const { hook, mockItem } = setup({
      src: SRC,
      subscriptions: { [LottieSubscription.complete]: onComplete },
    });
    fireLoaded(mockItem);
    act(() => {
      mockItem._fireEvent("complete");
    });
    expect(onComplete).toHaveBeenCalledOnce();
    expect(hook.result.current.state).toBe(LottieState.stopped);
    expect(mockItem.goToAndStop).toHaveBeenCalledWith(0);
  });

  it("fires loopCompleted subscription on loopComplete", () => {
    const onLoop = vi.fn();
    const { mockItem } = setup({
      src: SRC,
      subscriptions: { [LottieSubscription.loopCompleted]: onLoop },
    });
    fireLoaded(mockItem);
    act(() => {
      mockItem._fireEvent("loopComplete");
    });
    expect(onLoop).toHaveBeenCalledOnce();
  });
});

// ─── Playback controls ───────────────────────────────────────────────────────

describe("useLottieFactory — play/pause/stop", () => {
  it("play calls animationItem.play and transitions to playing", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.play();
    });
    expect(mockItem.play).toHaveBeenCalledOnce();
    expect(hook.result.current.state).toBe(LottieState.playing);
  });

  it("play in left direction at frame 0 calls goToAndPlay(totalFrames)", () => {
    const mockItem = createMockAnimationItem({ currentFrame: 0 });
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(() =>
      useLottieFactory(mockLottie as unknown as LottiePlayer, {
        src: SRC,
        initialValues: { direction: Direction.left },
      }),
    );
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.play();
    });
    expect(mockItem.goToAndPlay).toHaveBeenCalledWith(
      mockItem.totalFrames,
      true,
    );
    expect(mockItem.play).not.toHaveBeenCalled();
  });

  it("pause calls animationItem.pause and transitions to paused", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.pause();
    });
    expect(mockItem.pause).toHaveBeenCalledOnce();
    expect(hook.result.current.state).toBe(LottieState.paused);
  });

  it("stop calls goToAndStop(0) and transitions to stopped", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.stop();
    });
    expect(mockItem.goToAndStop).toHaveBeenCalledWith(0);
    expect(hook.result.current.state).toBe(LottieState.stopped);
  });

  it("play/pause/stop do nothing before animationItem is initialized", () => {
    // Before DOMLoaded fires, animationItem is still null
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(() => useLottieFactory(mockLottie as unknown as LottiePlayer, { src: SRC }));
    expect(() => {
      act(() => {
        hook.result.current.play();
        hook.result.current.pause();
        hook.result.current.stop();
      });
    }).not.toThrow();
  });
});

// ─── Controls ────────────────────────────────────────────────────────────────

describe("useLottieFactory — controls", () => {
  it("toggleLoop flips the loop value", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    const before = hook.result.current.loop;
    act(() => {
      hook.result.current.toggleLoop();
    });
    expect(hook.result.current.loop).toBe(!before);
  });

  it("changeDirection(left) calls setDirection(-1) and updates direction", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.changeDirection(Direction.left);
    });
    expect(hook.result.current.direction).toBe(Direction.left);
    expect(mockItem.setDirection).toHaveBeenCalledWith(-1);
  });

  it("changeDirection(right) calls setDirection(1)", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.changeDirection(Direction.right);
    });
    expect(mockItem.setDirection).toHaveBeenCalledWith(1);
  });

  it("changeSpeed updates speed and calls setSpeed", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.changeSpeed(2);
    });
    expect(hook.result.current.speed).toBe(2);
    expect(mockItem.setSpeed).toHaveBeenCalledWith(2);
  });
});

// ─── Seek ────────────────────────────────────────────────────────────────────

describe("useLottieFactory — seek", () => {
  it("seek with a frame number calls goToAndStop", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.seek(50, false);
    });
    expect(mockItem.goToAndStop).toHaveBeenCalledWith(50, true);
  });

  it("seek with a percentage string resolves correctly", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.seek("50%", false);
    });
    expect(mockItem.goToAndStop).toHaveBeenCalledWith(
      (mockItem.totalFrames * 50) / 100,
      true,
    );
  });

  it("seek with an invalid value does nothing", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    mockItem.goToAndStop.mockClear();
    act(() => {
      hook.result.current.seek("invalid", false);
    });
    expect(mockItem.goToAndStop).not.toHaveBeenCalled();
  });

  it("seek(value, true) after playing restores playing state", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    act(() => {
      hook.result.current.play();
    });
    act(() => {
      hook.result.current.seek(30, false);
    }); // snapshot state=playing
    act(() => {
      hook.result.current.seek(30, true);
    }); // end drag
    expect(mockItem.goToAndPlay).toHaveBeenCalledWith(30, true);
    expect(hook.result.current.state).toBe(LottieState.playing);
  });
});

// ─── Subscriptions ───────────────────────────────────────────────────────────

describe("useLottieFactory — subscriptions", () => {
  it("subscription handler receives events", () => {
    const onFrame = vi.fn();
    const { mockItem } = setup({
      src: SRC,
      subscriptions: { [LottieSubscription.frame]: onFrame },
    });
    fireLoaded(mockItem);
    act(() => {
      mockItem._fireEvent("enterFrame");
    });
    expect(onFrame).toHaveBeenCalled();
  });

  it("latest handler reference is used after rerender (ref-forwarding)", () => {
    const first = vi.fn();
    const second = vi.fn();
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(
      ({ cb }) =>
        useLottieFactory(mockLottie as unknown as LottiePlayer, {
          src: SRC,
          subscriptions: { [LottieSubscription.frame]: cb },
        }),
      { initialProps: { cb: first } },
    );
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);

    hook.rerender({ cb: second });
    first.mockClear();
    second.mockClear();

    act(() => {
      mockItem._fireEvent("enterFrame");
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
  });
});

// ─── enableReinitialize ───────────────────────────────────────────────────────

describe("useLottieFactory — enableReinitialize", () => {
  it("does not apply initialValues changes when enableReinitialize is false", () => {
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(
      ({ loop }) =>
        useLottieFactory(mockLottie as unknown as LottiePlayer, {
          src: SRC,
          enableReinitialize: false,
          initialValues: { loop },
        }),
      { initialProps: { loop: false } },
    );
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);

    act(() => {
      hook.rerender({ loop: true });
    });

    expect(hook.result.current.loop).toBe(false);
  });

  it("applies loop changes when enableReinitialize is true", () => {
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(
      ({ loop }) =>
        useLottieFactory(mockLottie as unknown as LottiePlayer, {
          src: SRC,
          enableReinitialize: true,
          initialValues: { loop },
        }),
      { initialProps: { loop: false } },
    );
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);

    act(() => {
      hook.rerender({ loop: true });
    });

    expect(hook.result.current.loop).toBe(true);
  });

  it("applies direction changes when enableReinitialize is true", () => {
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(
      ({ direction }: { direction: Direction }) =>
        useLottieFactory(mockLottie as unknown as LottiePlayer, {
          src: SRC,
          enableReinitialize: true,
          initialValues: { direction },
        }),
      { initialProps: { direction: Direction.right as Direction } },
    );
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);

    act(() => {
      hook.rerender({ direction: Direction.left });
    });

    expect(hook.result.current.direction).toBe(Direction.left);
    expect(mockItem.setDirection).toHaveBeenCalledWith(-1);
  });

  it("applies speed changes when enableReinitialize is true", () => {
    const mockItem = createMockAnimationItem();
    const mockLottie = createMockLottie(mockItem);
    const hook = renderHook(
      ({ speed }) =>
        useLottieFactory(mockLottie as unknown as LottiePlayer, {
          src: SRC,
          enableReinitialize: true,
          initialValues: { speed },
        }),
      { initialProps: { speed: 1 } },
    );
    act(() => {
      hook.result.current.setContainerRef(document.createElement("div"));
    });
    fireLoaded(mockItem);

    act(() => {
      hook.rerender({ speed: 2 });
    });

    expect(hook.result.current.speed).toBe(2);
    expect(mockItem.setSpeed).toHaveBeenCalledWith(2);
  });
});

// ─── Cleanup ─────────────────────────────────────────────────────────────────

describe("useLottieFactory — cleanup", () => {
  it("calls destroy on unmount", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    hook.unmount();
    expect(mockItem.destroy).toHaveBeenCalled();
  });

  it("removes internal event listeners on unmount", () => {
    const { hook, mockItem } = setup();
    fireLoaded(mockItem);
    hook.unmount();
    expect(mockItem.removeEventListener).toHaveBeenCalled();
  });
});
