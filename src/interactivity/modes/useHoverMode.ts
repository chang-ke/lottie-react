import { useEffect, useRef } from "react";

import { Direction, LottieSubscription } from "../../types";
import {
  HoverConfig,
  InteractivityActionType,
  InteractivityTarget,
} from "../types";
import { resolveFrame } from "../utils/resolveFrames";

export const useHoverMode = (
  target: InteractivityTarget,
  config: HoverConfig,
  enabled: boolean,
): void => {
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    if (!enabled) return;

    const container = target.containerRef.current;
    if (!container) return;

    // Unsubscribe handle for frame watcher (used by reverseOnLeave)
    let unsubscribeFrame: (() => void) | null = null;

    const handleEnter = () => {
      const { animationItem } = target;
      if (!animationItem) return;

      const cfg = configRef.current;

      // Cancel any leave-triggered frame watcher
      if (unsubscribeFrame) {
        unsubscribeFrame();
        unsubscribeFrame = null;
      }

      // Restore forward direction in case leave reversed it
      target.changeDirection(Direction.right);
      animationItem.loop = cfg.loop ?? false;

      const onEnter = cfg.onEnter ?? InteractivityActionType.play;

      if (onEnter === InteractivityActionType.seek && cfg.frames) {
        const frame = resolveFrame(cfg.frames[0], animationItem);
        animationItem.goToAndPlay(frame, true);
      } else if (onEnter === InteractivityActionType.play) {
        if (cfg.frames) {
          animationItem.playSegments(
            [
              resolveFrame(cfg.frames[0], animationItem),
              resolveFrame(cfg.frames[1], animationItem),
            ],
            true,
          );
        } else {
          target.play();
        }
      } else if (onEnter === InteractivityActionType.stop) {
        target.stop();
      }
    };

    const handleLeave = () => {
      const { animationItem } = target;
      if (!animationItem) return;

      const cfg = configRef.current;

      if (cfg.reverseOnLeave) {
        // Reverse direction and play back to frame 0
        target.changeDirection(Direction.left);
        animationItem.loop = false;
        target.play();

        // Stop exactly at frame 0
        unsubscribeFrame = target.subscribe(LottieSubscription.complete, () => {
          target.stop();
          target.changeDirection(Direction.right);
          if (unsubscribeFrame) {
            unsubscribeFrame();
            unsubscribeFrame = null;
          }
        });
        return;
      }

      const onLeave = cfg.onLeave ?? InteractivityActionType.stop;

      if (onLeave === InteractivityActionType.stop) {
        target.stop();
      } else if (onLeave === InteractivityActionType.play) {
        target.play();
      }
    };

    container.addEventListener("mouseenter", handleEnter);
    container.addEventListener("touchstart", handleEnter, { passive: true });
    container.addEventListener("mouseleave", handleLeave);
    container.addEventListener("touchend", handleLeave);

    return () => {
      if (unsubscribeFrame) unsubscribeFrame();
      container.removeEventListener("mouseenter", handleEnter);
      container.removeEventListener("touchstart", handleEnter);
      container.removeEventListener("mouseleave", handleLeave);
      container.removeEventListener("touchend", handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.containerRef.current, target.animationItem, enabled]);
};
