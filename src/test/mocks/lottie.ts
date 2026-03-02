import { vi } from "vitest";

import type { AnimationItem } from "lottie-web";
import type { Mock } from "vitest";

type FireEventFn = (name: string, payload?: unknown) => void;

/**
 * Concrete mock type for AnimationItem — all methods are Mock<F> PROPERTIES
 * (not method declarations), so @typescript-eslint/unbound-method does not fire
 * when accessing them in test assertions.
 *
 * This type is structurally compatible with AnimationItem (Mock<F> extends F),
 * so it can be assigned anywhere AnimationItem is expected.
 */
export interface MockAnimationItem {
  // ── Data properties ────────────────────────────────────────────────────────
  renderer: unknown;
  name: string;
  isLoaded: boolean;
  currentFrame: number;
  currentRawFrame: number;
  firstFrame: number;
  totalFrames: number;
  frameRate: number;
  frameMult: number;
  playSpeed: number;
  playDirection: number;
  playCount: number;
  isPaused: boolean;
  autoplay: boolean;
  loop: boolean | number;
  animationID: string;
  assetsPath: string;
  timeCompleted: number;
  segmentPos: number;
  isSubframeEnabled: boolean;
  segments: AnimationItem["segments"];
  markers: never[];

  // ── Method mocks as arrow-function properties (no unbound-method) ──────────
  play: Mock<() => void>;
  stop: Mock<() => void>;
  pause: Mock<() => void>;
  destroy: Mock<() => void>;
  togglePause: Mock<() => void>;
  goToAndStop: Mock<(value: number, isFrame?: boolean) => void>;
  goToAndPlay: Mock<(value: number, isFrame?: boolean) => void>;
  setSegment: Mock<(init: number, end: number) => void>;
  resetSegments: Mock<(forceFlag: boolean) => void>;
  hide: Mock<() => void>;
  show: Mock<() => void>;
  resize: Mock<() => void>;
  setSpeed: Mock<(speed: number) => void>;
  setDirection: Mock<(direction: number) => void>;
  setLoop: Mock<(isLooping: boolean) => void>;
  playSegments: Mock<(segments: unknown, forceFlag?: boolean) => void>;
  setSubframe: Mock<(useSubFrames: boolean) => void>;
  getDuration: Mock<(inFrames?: boolean) => number>;
  triggerEvent: Mock<(name: string, args: unknown) => void>;
  includeLayers: Mock<(data: unknown) => void>;
  addEventListener: Mock<(name: string, cb: (p: unknown) => void) => () => void>;
  removeEventListener: Mock<(name: string, cb?: (p: unknown) => void) => void>;

  // ── Test helper ─────────────────────────────────────────────────────────────
  _fireEvent: FireEventFn;
}

/**
 * Creates a mock AnimationItem that stores event listeners in a real Map
 * so tests can trigger them via `_fireEvent`.
 */
export const createMockAnimationItem = (
  overrides: Partial<AnimationItem> = {},
): MockAnimationItem => {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();

  return {
    renderer: undefined,
    name: "mock",
    isLoaded: true,
    currentFrame: 0,
    currentRawFrame: 0,
    firstFrame: 0,
    totalFrames: 100,
    frameRate: 30,
    frameMult: 1,
    playSpeed: 1,
    playDirection: 1,
    playCount: 0,
    isPaused: true,
    autoplay: false,
    loop: false,
    animationID: "mock-id",
    assetsPath: "",
    timeCompleted: 0,
    segmentPos: 0,
    isSubframeEnabled: false,
    segments: [] as AnimationItem["segments"],
    markers: [] as never[],
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    destroy: vi.fn(),
    togglePause: vi.fn(),
    goToAndStop: vi.fn(),
    goToAndPlay: vi.fn(),
    setSegment: vi.fn(),
    resetSegments: vi.fn(),
    hide: vi.fn(),
    show: vi.fn(),
    resize: vi.fn(),
    setSpeed: vi.fn(),
    setDirection: vi.fn(),
    setLoop: vi.fn(),
    playSegments: vi.fn(),
    setSubframe: vi.fn(),
    getDuration: vi.fn<(inFrames?: boolean) => number>().mockReturnValue(3.33),
    triggerEvent: vi.fn(),
    includeLayers: vi.fn(),
    addEventListener: vi.fn<(name: string, cb: (p: unknown) => void) => () => void>().mockImplementation(
      (name: string, cb: (p: unknown) => void) => {
        if (!listeners.has(name)) listeners.set(name, new Set());
        listeners.get(name)?.add(cb);
        return () => { listeners.get(name)?.delete(cb); };
      },
    ),
    removeEventListener: vi.fn().mockImplementation(
      (name: string, cb?: (p: unknown) => void) => {
        if (cb) listeners.get(name)?.delete(cb);
        else listeners.delete(name);
      },
    ),
    _fireEvent: (name: string, payload?: unknown) => {
      listeners.get(name)?.forEach((cb) => { cb(payload); });
    },
    ...overrides as Partial<MockAnimationItem>,
  };
};

/**
 * Concrete mock type for LottiePlayer — all methods are Mock<F> properties.
 */
export interface MockLottiePlayer {
  loadAnimation: Mock<(params: unknown) => MockAnimationItem>;
  play: Mock<() => void>;
  pause: Mock<() => void>;
  stop: Mock<() => void>;
  setSpeed: Mock<(speed: number) => void>;
  setDirection: Mock<(direction: number) => void>;
  searchAnimations: Mock<() => void>;
  destroy: Mock<() => void>;
  registerAnimation: Mock<() => void>;
  setQuality: Mock<() => void>;
  setLocationHref: Mock<() => void>;
  setIDPrefix: Mock<() => void>;
  updateDocumentData: Mock<() => void>;
}

/**
 * Creates a mock LottiePlayer whose `loadAnimation` returns the provided item.
 */
export const createMockLottie = (
  mockItem: MockAnimationItem,
): MockLottiePlayer => ({
  loadAnimation: vi.fn<(params: unknown) => MockAnimationItem>().mockReturnValue(mockItem),
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  setSpeed: vi.fn(),
  setDirection: vi.fn(),
  searchAnimations: vi.fn(),
  destroy: vi.fn(),
  registerAnimation: vi.fn(),
  setQuality: vi.fn(),
  setLocationHref: vi.fn(),
  setIDPrefix: vi.fn(),
  updateDocumentData: vi.fn(),
});
