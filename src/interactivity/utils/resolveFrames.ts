import { AnimationItem } from "lottie-web";

import { FrameSpecifier } from "../types";

// lottie-web's internal marker shape (not in public typings)
interface LottieMarker {
  payload?: { name?: string };
  time: number;
}

/**
 * Resolves a FrameSpecifier to an absolute frame number.
 *
 * - `number`     → returned as-is
 * - `"50%"`      → 50% of animationItem.totalFrames
 * - `"markerName"` → time of the named marker in the animation
 */
export const resolveFrame = (
  specifier: FrameSpecifier,
  animationItem: AnimationItem,
): number => {
  if (typeof specifier === "number") return specifier;

  if (specifier.endsWith("%")) {
    const percent = parseFloat(specifier) / 100;
    return Math.round(animationItem.totalFrames * percent);
  }

  // Named marker lookup
  const markers = (
    animationItem as unknown as { markers?: LottieMarker[] }
  ).markers;
  if (markers) {
    const marker = markers.find((m) => m.payload?.name === specifier);
    if (marker != null) return marker.time;
  }

  // Fallback: try to parse as plain number string
  const parsed = parseFloat(specifier);
  return isNaN(parsed) ? 0 : parsed;
};
