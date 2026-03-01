import { Lottie } from "./components/Lottie";

// ─── Components ───────────────────────────────────────────────────────────────
export { Lottie } from "./components/Lottie";
export { LottieLight } from "./components/LottieLight";

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useLottie } from "./hooks/useLottie";
export { useLottieLight } from "./hooks/useLottieLight";
export { useLottieInteractivity } from "./interactivity";

// ─── Enums ────────────────────────────────────────────────────────────────────
export {
  Direction,
  LottieRenderer,
  LottieState,
  LottieSubscription,
  LottieVersion,
} from "./types/enums";

// ─── Public types ─────────────────────────────────────────────────────────────
export type {
  LottiePlayerConfig,
  LottieProps,
  LottieRef,
  LottieSubscriptionAction,
  LottieSubscriptions,
  UseLottieFactoryOptions,
  UseLottieFactoryResult,
} from "./types/types";

// ─── Player types (for consumers configuring the built-in player) ─────────────
export type {
  LoadingOverlayConfig,
  LoadingOverlayOptions,
  PlayerElements,
  PlayerOverlays,
  PlayerResponsive,
  PlayerTheme,
} from "./player/types";

// ─── Interactivity ────────────────────────────────────────────────────────────
export {
  ChainTransitionType,
  InteractivityActionType,
  InteractivityMode,
} from "./interactivity";

export type {
  ChainConfig,
  ChainState,
  ChainTransition,
  ClickConfig,
  CursorAction,
  CursorConfig,
  FrameRange,
  FrameSpecifier,
  HoverConfig,
  InteractivityConfig,
  InteractivityTarget,
  ScrollAction,
  ScrollConfig,
  ScrollContainer,
  UseLottieInteractivityResult,
} from "./interactivity";

export default Lottie;
