import { RefObject } from "react";

import type { UseLottieFactoryResult } from "../types/types";

// ─── Enums (const+type pattern, matching project convention) ──────────────────

export const InteractivityMode = {
  scroll: "scroll",
  cursor: "cursor",
  hover: "hover",
  click: "click",
  chain: "chain",
} as const;
export type InteractivityMode =
  (typeof InteractivityMode)[keyof typeof InteractivityMode];

export const InteractivityActionType = {
  seek: "seek",
  play: "play",
  stop: "stop",
  loop: "loop",
  playSegments: "playSegments",
} as const;
export type InteractivityActionType =
  (typeof InteractivityActionType)[keyof typeof InteractivityActionType];

export const ChainTransitionType = {
  click: "click",
  hover: "hover",
  repeat: "repeat",
  hold: "hold",
  pauseHold: "pauseHold",
  onComplete: "onComplete",
  delay: "delay",
} as const;
export type ChainTransitionType =
  (typeof ChainTransitionType)[keyof typeof ChainTransitionType];

// ─── FrameSpecifier ───────────────────────────────────────────────────────────

/**
 * A frame specifier:
 * - `number` — absolute frame index
 * - `"50%"`  — percentage of totalFrames
 * - `"intro"` — named animation marker
 */
export type FrameSpecifier = number | string;
export type FrameRange = [FrameSpecifier, FrameSpecifier];

// ─── Scroll mode ─────────────────────────────────────────────────────────────

export interface ScrollAction {
  /** Visibility range [min, max] in 0..1 that triggers this action */
  visibility: [number, number];
  type: InteractivityActionType;
  /** Frame range for seek/playSegments types */
  frames?: FrameRange;
}

export type ScrollContainer =
  | "self"
  | "window"
  | HTMLElement
  | RefObject<HTMLElement | null>;

export interface ScrollConfig {
  mode: typeof InteractivityMode.scroll;
  actions: ScrollAction[];
  /** Scroll container to listen on. Defaults to "window". */
  container?: ScrollContainer;
}

// ─── Cursor mode ─────────────────────────────────────────────────────────────

export interface CursorAction {
  /** Normalised position range (0..1) that triggers this action */
  position: { x: [number, number]; y?: [number, number] };
  type: InteractivityActionType;
  frames?: FrameRange;
}

export interface CursorConfig {
  mode: typeof InteractivityMode.cursor;
  actions: CursorAction[];
}

// ─── Hover mode ──────────────────────────────────────────────────────────────

export interface HoverConfig {
  mode: typeof InteractivityMode.hover;
  /** Action to perform on mouse enter. Defaults to "play". */
  onEnter?: InteractivityActionType;
  /** Action to perform on mouse leave. Defaults to "stop". */
  onLeave?: InteractivityActionType;
  /** Optional frame range to constrain playback to */
  frames?: FrameRange;
  /** Reverse direction and play back to start on leave */
  reverseOnLeave?: boolean;
  /** Whether to loop during hover */
  loop?: boolean;
}

// ─── Click mode ──────────────────────────────────────────────────────────────

export interface ClickConfig {
  mode: typeof InteractivityMode.click;
  type: InteractivityActionType;
  frames?: FrameRange;
  /** Toggle play/pause on each click */
  toggle?: boolean;
  /** Stop after N completions */
  count?: number;
}

// ─── Chain mode ──────────────────────────────────────────────────────────────

export interface ChainTransition {
  type: ChainTransitionType;
  /** Target state name. If omitted, advances to next state in array. */
  target?: string;
  /** For "repeat" type: number of loop completions before advancing */
  count?: number;
  /** For "delay" type: milliseconds before advancing */
  delay?: number;
}

export interface ChainState {
  name: string;
  type: InteractivityActionType;
  frames?: FrameRange;
  transition: ChainTransition;
  /** Loop this state's animation */
  loop?: boolean;
  speed?: number;
}

export interface ChainConfig {
  mode: typeof InteractivityMode.chain;
  states: ChainState[];
  /** Name of the initial state. Defaults to first state. */
  initialState?: string;
  /** Loop from last state back to first */
  loop?: boolean;
}

// ─── Discriminated union ─────────────────────────────────────────────────────

export type InteractivityConfig =
  | ScrollConfig
  | CursorConfig
  | HoverConfig
  | ClickConfig
  | ChainConfig;

// ─── Adapter interface ────────────────────────────────────────────────────────

/**
 * Narrow interface consumed by useLottieInteractivity.
 * Subset of UseLottieFactoryResult — keeps interactivity decoupled from the full hook.
 */
export interface InteractivityTarget {
  containerRef: UseLottieFactoryResult["containerRef"];
  animationItem: UseLottieFactoryResult["animationItem"];
  play: UseLottieFactoryResult["play"];
  pause: UseLottieFactoryResult["pause"];
  stop: UseLottieFactoryResult["stop"];
  subscribe: UseLottieFactoryResult["subscribe"];
  totalFrames: UseLottieFactoryResult["totalFrames"];
  changeDirection: UseLottieFactoryResult["changeDirection"];
}

// ─── Return type ─────────────────────────────────────────────────────────────

export interface UseLottieInteractivityResult {
  isActive: boolean;
  currentChainState: string | null;
  goToChainState: (name: string) => void;
  disable: () => void;
  enable: () => void;
}
