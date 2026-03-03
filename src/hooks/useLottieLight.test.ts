import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LottieState } from "../types";

const loadAnimationMock = vi.fn();

vi.mock("lottie-web/build/player/lottie_light", () => ({
  default: { loadAnimation: loadAnimationMock },
}));

const { useLottieLight } = await import("./useLottieLight");

describe("useLottieLight", () => {
  beforeEach(() => {
    loadAnimationMock.mockReturnValue({
      totalFrames: 100,
      currentFrame: 0,
      autoplay: false,
      loop: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      destroy: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      goToAndStop: vi.fn(),
      goToAndPlay: vi.fn(),
      setSpeed: vi.fn(),
      setDirection: vi.fn(),
    });
  });

  it("starts in loading state", () => {
    const { result } = renderHook(() => useLottieLight({ src: { v: "5.0" } }));
    expect(result.current.state).toBe(LottieState.loading);
  });

  it("calls loadAnimation on the light build after container is attached", () => {
    const { result } = renderHook(() => useLottieLight({ src: { v: "5.0" } }));
    act(() => {
      result.current.setContainerRef(document.createElement("div"));
    });
    expect(loadAnimationMock).toHaveBeenCalled();
  });

  it("exposes the full factory result shape", () => {
    const { result } = renderHook(() => useLottieLight({ src: { v: "5.0" } }));
    expect(result.current).toHaveProperty("play");
    expect(result.current).toHaveProperty("pause");
    expect(result.current).toHaveProperty("stop");
  });
});
