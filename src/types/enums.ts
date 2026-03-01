/**
 * Lottie animation states
 */
export const LottieState = {
  loading: "loading",
  playing: "playing",
  paused: "paused",
  stopped: "stopped",
  frozen: "frozen",
  failure: "failure",
} as const;
export type LottieState = (typeof LottieState)[keyof typeof LottieState];

/**
 * Lottie subscription event types
 */
export const LottieSubscription = {
  failure: "failure",
  ready: "ready",
  play: "play",
  pause: "pause",
  stop: "stop",
  loopCompleted: "loop_completed",
  complete: "complete",
  frame: "frame",
  newState: "new_state",
} as const;
export type LottieSubscription = (typeof LottieSubscription)[keyof typeof LottieSubscription];

/**
 * Animation build versions — full (all renderers) and light (SVG-only)
 */
export const LottieVersion = {
  full: "full",
  light: "light",
} as const;
export type LottieVersion = (typeof LottieVersion)[keyof typeof LottieVersion];

/**
 * Render types that the animation supports
 */
export const LottieRenderer = {
  svg: "svg",
  html: "html",
  canvas: "canvas",
} as const;
export type LottieRenderer = (typeof LottieRenderer)[keyof typeof LottieRenderer];

/**
 * Playback direction
 */
export const Direction = {
  right: "right",
  left: "left",
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];
