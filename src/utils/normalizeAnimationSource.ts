import { AnimationConfigWithData, AnimationConfigWithPath } from "lottie-web";

type NormalizedSource =
  | Pick<AnimationConfigWithData, "animationData">
  | Pick<AnimationConfigWithPath, "path">;

/**
 * Converts the consumer-facing `src` prop into the format expected by lottie-web.
 *
 * Accepts:
 * - A non-empty string — treated as a URL/path (supports `.json`, `.lottie`,
 *   query-string URLs, etc. — lottie-web handles the actual loading)
 * - A plain object — passed directly as `animationData`
 *
 * Returns `null` when the source is missing or invalid.
 */
const normalizeAnimationSource = (source: unknown): NormalizedSource | null => {
  if (source && typeof source === "string" && source.trim().length > 0) {
    return { path: source.trim() };
  }

  if (source && typeof source === "object" && !Array.isArray(source)) {
    return { animationData: source };
  }

  return null;
};

export default normalizeAnimationSource;
