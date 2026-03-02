import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Build the mock item once, before any imports are resolved
const mockItem = vi.hoisted(() => ({
  name: "mock", isLoaded: true, currentFrame: 0, currentRawFrame: 0, firstFrame: 0,
  totalFrames: 100, frameRate: 30, frameMult: 1, playSpeed: 1, playDirection: 1,
  playCount: 0, isPaused: true, autoplay: false, loop: false, animationID: "mock-id",
  assetsPath: "", timeCompleted: 0, segmentPos: 0, isSubframeEnabled: false,
  segments: [], markers: [],
  play: vi.fn(), stop: vi.fn(), pause: vi.fn(), destroy: vi.fn(), togglePause: vi.fn(),
  goToAndStop: vi.fn(), goToAndPlay: vi.fn(), setSegment: vi.fn(), resetSegments: vi.fn(),
  hide: vi.fn(), show: vi.fn(), resize: vi.fn(), setSpeed: vi.fn(), setDirection: vi.fn(),
  setLoop: vi.fn(), playSegments: vi.fn(), setSubframe: vi.fn(),
  getDuration: vi.fn().mockReturnValue(3.33), triggerEvent: vi.fn(), includeLayers: vi.fn(),
  addEventListener: vi.fn(), removeEventListener: vi.fn(),
}));

vi.mock("lottie-web/build/player/lottie_light", () => ({
  default: { loadAnimation: vi.fn().mockReturnValue(mockItem) },
}));

import { LottieLight } from "./LottieLight";

// Stable src — must be defined outside render() to avoid re-initialization loops
const SRC = { v: "5.0" };

describe("LottieLight", () => {
  it("is a React component (not null)", () => {
    expect(LottieLight).not.toBeNull();
  });

  it("renders without crashing", () => {
    const { container } = render(<LottieLight src={SRC} />);
    expect(container.firstChild).not.toBeNull();
  });
});
