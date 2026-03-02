import lottieLight from "lottie-web/build/player/lottie_light";

import {
  LottieVersion,
  UseLottieFactoryOptions,
  UseLottieFactoryResult,
} from "../types";

import { useLottieFactory } from "./useLottieFactory";

/**
 * Hook for rendering Lottie animations using the lottie_light build (SVG-only).
 * Significantly smaller bundle size — use this when Canvas/HTML rendering is not needed.
 *
 * @example
 * const { setContainerRef, play, pause } = useLottieLight({ src: animationData });
 * return <div ref={setContainerRef} />;
 */
export const useLottieLight = (
  options: UseLottieFactoryOptions<typeof LottieVersion.light>,
): UseLottieFactoryResult =>
  useLottieFactory<typeof LottieVersion.light>(lottieLight, options);
