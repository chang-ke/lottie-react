import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LottieState } from "../types";

// vi.mock is hoisted before imports, so mock object must be defined inline.
// The factory test (useLottieFactory.test.tsx) already covers detailed behavior.
const loadAnimationMock = vi.fn();

vi.mock("lottie-web", () => ({
  default: { loadAnimation: loadAnimationMock },
}));

const { useLottie } = await import("./useLottie");

describe("useLottie", () => {
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
    const { result } = renderHook(() => useLottie({ src: { v: "5.0" } }));
    expect(result.current.state).toBe(LottieState.loading);
  });

  it("calls loadAnimation after container is attached", () => {
    const { result } = renderHook(() => useLottie({ src: { v: "5.0" } }));
    act(() => { result.current.setContainerRef(document.createElement("div")); });
    expect(loadAnimationMock).toHaveBeenCalled();
  });

  it("exposes the full factory result shape", () => {
    const { result } = renderHook(() => useLottie({ src: { v: "5.0" } }));
    expect(result.current).toHaveProperty("play");
    expect(result.current).toHaveProperty("pause");
    expect(result.current).toHaveProperty("stop");
    expect(result.current).toHaveProperty("seek");
    expect(result.current).toHaveProperty("subscribe");
  });
});
