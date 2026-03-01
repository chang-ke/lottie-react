import { useEffect, useRef } from "react";

import { InteractivityActionType, InteractivityTarget, ScrollConfig } from "../types";
import { mapRange } from "../utils/mapRange";
import { resolveFrame } from "../utils/resolveFrames";

/**
 * Computes scroll progress (0..1) for an element.
 *
 * When `scrollEl` is `window`, progress is relative to the browser viewport.
 * When `scrollEl` is an `HTMLElement`, progress is relative to that element's
 * visible client area (handles overflow:auto/scroll containers correctly).
 *
 * 0 = element bottom just entered the viewport, 1 = element top just exited.
 */
const computeScrollProgress = (
  el: HTMLElement,
  scrollEl: HTMLElement | Window,
): number => {
  const rect = el.getBoundingClientRect();
  let viewH: number;
  let viewOffsetTop = 0;

  if (scrollEl instanceof HTMLElement) {
    const containerRect = scrollEl.getBoundingClientRect();
    viewH = scrollEl.clientHeight;
    viewOffsetTop = containerRect.top;
  } else {
    viewH = window.innerHeight;
  }

  const relTop = rect.top - viewOffsetTop;
  const raw = (viewH - relTop) / (viewH + rect.height);
  return Math.min(Math.max(raw, 0), 1);
};

/**
 * Resolves the scroll container to a DOM element or Window.
 */
const resolveScrollEl = (
  container: ScrollConfig["container"],
  selfEl: HTMLElement,
): HTMLElement | Window => {
  if (!container || container === "window") return window;
  if (container === "self") return selfEl;
  if (container instanceof HTMLElement) return container;
  // RefObject
  return container.current ?? window;
};

export const useScrollMode = (
  target: InteractivityTarget,
  config: ScrollConfig,
  enabled: boolean,
): void => {
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (!enabled) return;

    const container = target.containerRef.current;
    if (!container) return;

    // Resolve the scroll container once at setup time.
    // For RefObject containers, the ref should already be assigned by now.
    const scrollEl = resolveScrollEl(configRef.current.container, container);

    // Boxed so TypeScript's flow analysis doesn't narrow it to always-false
    const visibility = { current: false };

    const handleScroll = () => {
      const { animationItem } = target;
      if (!animationItem) return;

      const progress = computeScrollProgress(container, scrollEl);
      const { actions } = configRef.current;

      for (const action of actions) {
        const [visMin, visMax] = action.visibility;
        if (progress < visMin || progress > visMax) continue;

        if (action.type === InteractivityActionType.seek) {
          const frames = action.frames ?? [0, animationItem.totalFrames];
          const frame = Math.round(
            mapRange(progress, action.visibility, [
              resolveFrame(frames[0], animationItem),
              resolveFrame(frames[1], animationItem),
            ]),
          );
          animationItem.goToAndStop(frame, true);
        } else if (action.type === InteractivityActionType.play) {
          if (animationItem.isPaused) target.play();
        } else if (action.type === InteractivityActionType.stop) {
          if (!animationItem.isPaused) target.stop();
        } else if (action.type === InteractivityActionType.loop) {
          animationItem.loop = true;
          if (animationItem.isPaused) target.play();
        } else {
          // InteractivityActionType.playSegments
          const frames = action.frames ?? [0, animationItem.totalFrames];
          animationItem.playSegments(
            [
              resolveFrame(frames[0], animationItem),
              resolveFrame(frames[1], animationItem),
            ],
            true,
          );
        }
        break; // first matching action wins
      }
    };

    // Use the scroll container as IntersectionObserver root when it's an element.
    // This ensures isIntersecting reflects visibility within the scroll container,
    // not the global viewport.
    const observerRoot = scrollEl instanceof HTMLElement ? scrollEl : null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(0);
        if (entry == null) return;

        if (entry.isIntersecting && !visibility.current) {
          visibility.current = true;
          scrollEl.addEventListener("scroll", handleScroll, { passive: true });
          handleScroll(); // sync on enter
        } else if (!entry.isIntersecting && visibility.current) {
          visibility.current = false;
          scrollEl.removeEventListener("scroll", handleScroll);
        }
      },
      { threshold: 0, root: observerRoot },
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (visibility.current) {
        scrollEl.removeEventListener("scroll", handleScroll);
      }
    };
  // containerRef.current and animationItem are the meaningful deps here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.containerRef.current, target.animationItem, enabled]);
};
