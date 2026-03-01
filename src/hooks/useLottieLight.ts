import lottieLight from "lottie-web/build/player/lottie_light";

import { LottieVersion } from "../types/enums";

import { useLottieFactory } from "./useLottieFactory";

import type { UseLottieFactoryOptions, UseLottieFactoryResult } from "../types/types";


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
): UseLottieFactoryResult => useLottieFactory<typeof LottieVersion.light>(lottieLight, options);
