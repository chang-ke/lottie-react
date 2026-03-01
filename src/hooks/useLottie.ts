import lottie from "lottie-web";

import { useLottieFactory } from "./useLottieFactory";

import type { UseLottieFactoryOptions, UseLottieFactoryResult } from "../types/types";

/**
 * Hook for rendering Lottie animations using the full lottie-web build.
 * Supports SVG, Canvas, and HTML renderers.
 *
 * @example
 * const { setContainerRef, play, pause } = useLottie({ src: animationData });
 * return <div ref={setContainerRef} />;
 */
export const useLottie = (
  options: UseLottieFactoryOptions,
): UseLottieFactoryResult =>
  useLottieFactory(lottie, options);
