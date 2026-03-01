import { useEffect, useRef } from "react";

import { CursorConfig, InteractivityActionType, InteractivityTarget } from "../types";
import { mapRange } from "../utils/mapRange";
import { resolveFrame } from "../utils/resolveFrames";

export const useCursorMode = (
  target: InteractivityTarget,
  config: CursorConfig,
  enabled: boolean,
): void => {
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (!enabled) return;

    const container = target.containerRef.current;
    if (!container) return;

    // rAF throttle state
    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const process = () => {
      rafId = null;
      const { animationItem } = target;
      if (!animationItem) return;

      const { actions } = configRef.current;

      for (const action of actions) {
        const { x, y } = action.position;
        const xMatch = pendingX >= x[0] && pendingX <= x[1];
        const yMatch = y == null || (pendingY >= y[0] && pendingY <= y[1]);
        if (!xMatch || !yMatch) continue;

        if (action.type === InteractivityActionType.seek) {
          const frames = action.frames ?? [0, animationItem.totalFrames];
          const frame = Math.round(
            mapRange(pendingX, x, [
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
        }
        break;
      }
    };

    const scheduleUpdate = (x: number, y: number) => {
      pendingX = x;
      pendingY = y;
      rafId ??= requestAnimationFrame(process);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
      scheduleUpdate(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches.item(0);
      if (touch == null) return;
      const rect = container.getBoundingClientRect();
      const x = Math.min(Math.max((touch.clientX - rect.left) / rect.width, 0), 1);
      const y = Math.min(Math.max((touch.clientY - rect.top) / rect.height, 0), 1);
      scheduleUpdate(x, y);
    };

    const handleLeave = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleLeave);
    container.addEventListener("touchend", handleLeave);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleLeave);
      container.removeEventListener("touchend", handleLeave);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.containerRef.current, target.animationItem, enabled]);
};
