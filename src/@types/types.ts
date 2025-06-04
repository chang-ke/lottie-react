import {
  AnimationEventCallback,
  AnimationEventName,
  AnimationItem,
  AnimationSegment,
  CanvasRendererConfig,
  HTMLRendererConfig,
  SVGRendererConfig,
} from "lottie-web";
import { JSX, RefCallback, RefObject } from "react";

import { SubscriptionManager } from "../utils/SubscriptionManager";

import {
  Direction,
  LottieRenderer,
  LottieState,
  LottieSubscription,
  LottieVersion,
  PlayerControlsElement,
} from "./enums";

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
export type LottieSubscriptionAction<T = unknown> = (event: T) => void;

/**
 * Describing the action to take for each subscription type
 */
export interface LottieSubscriptions {
  [LottieSubscription.Frame]: LottieSubscriptionAction<{
    currentFrame: number;
  }>;
  [LottieSubscription.Complete]: LottieSubscriptionAction;
  [LottieSubscription.LoopCompleted]: LottieSubscriptionAction;
  [LottieSubscription.Ready]: LottieSubscriptionAction;
  [LottieSubscription.Play]: LottieSubscriptionAction;
  [LottieSubscription.Pause]: LottieSubscriptionAction;
  [LottieSubscription.Stop]: LottieSubscriptionAction;
  [LottieSubscription.Failure]: LottieSubscriptionAction;
  [LottieSubscription.NewState]: LottieSubscriptionAction<{
    state: LottieState;
  }>;
}

/**
 * Options for the `useLottieFactory()` hook
 *
 * These options are wrapping Lottie's config properties and ads
 * additional ones in order to have a better control over the animation
 */
export type UseLottieFactoryOptions<
  Version extends LottieVersion = LottieVersion.Full,
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

  // TODO: add support for the following
  // audioFactory?(assetPath: string): {
  //   play(): void;
  //   seek(): void;
  //   playing(): void;
  //   rate(): void;
  //   setVolume(): void;
  // };
} & (
  | {
      renderer?: LottieRenderer.Svg;
      rendererSettings?: SVGRendererConfig;
    }
  | (Version extends LottieVersion.Full
      ?
          | {
              renderer?: LottieRenderer.Canvas;
              rendererSettings?: CanvasRendererConfig;
            }
          | {
              renderer?: LottieRenderer.Html;
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
 * Options for the `useLottieState()` hook
 */
export interface UseLottieStateOptions {
  initialState: LottieState;
  onChange?: (
    previousState: undefined | LottieState,
    newState: LottieState,
  ) => void;
}

/**
 * Type for Lottie's `ref` property
 */
export type LottieRef = Omit<UseLottieFactoryResult, "setContainerRef">;

/**
 * External player configuration
 */
export interface PlayerConfig {
  enabled?: boolean;
  theme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      backgroundHover?: string;
      text?: string;
      border?: string;
      accent?: string;
    };
    sizing?: {
      height?: number;
      buttonSize?: number;
      fontSize?: number;
      borderRadius?: number;
    };
    spacing?: {
      padding?: number;
      gap?: number;
    };
    effects?: {
      backdropBlur?: boolean;
      shadows?: boolean;
      transitions?: boolean;
    };
  };
  elements?: {
    playPause?: boolean;
    stop?: boolean;
    progressBar?: boolean;
    frameIndicator?: boolean;
    speed?: boolean;
    direction?: boolean;
    loop?: boolean;
    fullscreen?: boolean;
  };
  responsive?: {
    enabled?: boolean;
    breakpoint?: number;
    compact?: boolean;
    hideOnMobile?: {
      playPause?: boolean;
      stop?: boolean;
      progressBar?: boolean;
      frameIndicator?: boolean;
      speed?: boolean;
      direction?: boolean;
      loop?: boolean;
      fullscreen?: boolean;
    };
  };
  overlays?: {
    loading?: JSX.Element;
    error?: JSX.Element;
  };
}

/**
 * Properties for the `Lottie` & `LottieLight` components
 */
export type LottieProps<Version extends LottieVersion = LottieVersion.Full> =
  UseLottieFactoryOptions<Version> & {
    // Legacy controls (for backwards compatibility) - will use internal player
    controls?: boolean | PlayerControlsElement[];
    
    // New external player configuration - overrides controls if provided
    player?: PlayerConfig;
    
    LoadingOverlay?: JSX.Element;
    LoadingOverlayContent?: JSX.Element;
    loadingMinDisplayTime?: number;
    loadingFadeOutTime?: number;
    disableLoading?: boolean;
    FailureOverlay?: JSX.Element;
    FailureOverlayContent?: JSX.Element;
    disableFailure?: boolean;
  };
