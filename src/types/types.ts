import {
  AnimationEventCallback,
  AnimationEventName,
  AnimationItem,
  AnimationSegment,
  CanvasRendererConfig,
  HTMLRendererConfig,
  SVGRendererConfig,
} from "lottie-web";
import { RefCallback, RefObject } from "react";

import { SubscriptionManager } from "../utils/SubscriptionManager";

import {
  Direction,
  LottieRenderer,
  LottieState,
  LottieSubscription,
  LottieVersion,
} from "./enums";

import type {
  PlayerElements,
  PlayerOverlays,
  PlayerResponsive,
  PlayerTheme,
} from "../player/types";

/**
 * Shape of the internal listener
 */
export interface InternalListener {
  name: AnimationEventName;
  handler: AnimationEventCallback;
}

/**
 * The generic type for the subscription's action
 */
export type LottieSubscriptionAction<T = void> = (event: T) => void;

/**
 * Describing the action to take for each subscription type.
 * Keys are derived from LottieSubscription const values — if a value changes,
 * the key here updates automatically.
 */
export interface LottieSubscriptions {
  [LottieSubscription.frame]: LottieSubscriptionAction<{ currentFrame: number }>;
  [LottieSubscription.complete]: LottieSubscriptionAction;
  [LottieSubscription.loopCompleted]: LottieSubscriptionAction;
  [LottieSubscription.ready]: LottieSubscriptionAction;
  [LottieSubscription.play]: LottieSubscriptionAction;
  [LottieSubscription.pause]: LottieSubscriptionAction;
  [LottieSubscription.stop]: LottieSubscriptionAction;
  [LottieSubscription.failure]: LottieSubscriptionAction;
  [LottieSubscription.newState]: LottieSubscriptionAction<{ state: LottieState }>;
}

/**
 * Options for the `useLottieFactory()` hook
 *
 * These options wrap Lottie's config properties and add additional ones
 * for better control over the animation.
 */
export type UseLottieFactoryOptions<
  Version extends LottieVersion = typeof LottieVersion.full,
> = {
  src: string | Record<string | number | symbol, unknown>;
  initialValues?: {
    loop?: boolean | number;
    direction?: Direction;
    speed?: number;
    autoplay?: boolean;
    segment?: AnimationSegment;
    assetsPath?: string;
  };
  enableReinitialize?: boolean;
  debug?: boolean;
  subscriptions?: Partial<LottieSubscriptions>;
} & (
  | {
      renderer?: typeof LottieRenderer.svg;
      rendererSettings?: SVGRendererConfig;
    }
  | (Version extends typeof LottieVersion.full
      ?
          | {
              renderer?: typeof LottieRenderer.canvas;
              rendererSettings?: CanvasRendererConfig;
            }
          | {
              renderer?: typeof LottieRenderer.html;
              rendererSettings?: HTMLRendererConfig;
            }
      : never)
);

/**
 * Object returned by `useLottieFactory()`
 */
export interface UseLottieFactoryResult {
  containerRef: RefObject<HTMLDivElement | null>;
  setContainerRef: RefCallback<HTMLDivElement>;
  animationItem: AnimationItem | null;
  state: LottieState;
  loop: boolean | number;
  play: () => void;
  pause: () => void;
  stop: () => void;
  toggleLoop: () => void;
  changeDirection: (direction: Direction) => void;
  speed: number;
  changeSpeed: (speed: number) => void;
  seek: (value: number | string, isSeekingEnded: boolean) => void;
  subscribe: SubscriptionManager<LottieSubscriptions>["subscribe"];
  totalFrames: number;
  direction: Direction;
}

/**
 * Type for Lottie's `ref` property
 */
export type LottieRef = Omit<UseLottieFactoryResult, "setContainerRef">;

/**
 * Consumer-facing Player configuration passed to the `player` prop
 * of the `<Lottie>` and `<LottieLight>` components.
 */
export interface LottiePlayerConfig {
  theme?: PlayerTheme;
  controls?: boolean | PlayerElements;
  responsive?: PlayerResponsive;
  overlays?: PlayerOverlays;
}

/**
 * Properties for the `Lottie` & `LottieLight` components
 */
export type LottieProps<
  Version extends LottieVersion = typeof LottieVersion.full,
> = UseLottieFactoryOptions<Version> & {
  player?: LottiePlayerConfig;
};
