import { useEffect, useRef } from "react";

import { LottieSubscription } from "../../types";
import {
  ClickConfig,
  InteractivityActionType,
  InteractivityTarget,
} from "../types";
import { resolveFrame } from "../utils/resolveFrames";

export const useClickMode = (
  target: InteractivityTarget,
  config: ClickConfig,
  enabled: boolean,
): void => {
  const configRef = useRef(config);
  configRef.current = config;

  // Mutable state that doesn't need to cause re-renders
  const countRef = useRef(0);
  const isPlayingRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = target.containerRef.current;
    if (!container) return;

    const handleClick = () => {
      const { animationItem } = target;
      if (!animationItem) return;

      const cfg = configRef.current;

      if (cfg.count != null && countRef.current >= cfg.count) return;

      if (cfg.toggle) {
        if (isPlayingRef.current) {
          target.pause();
          isPlayingRef.current = false;
        } else {
          target.play();
          isPlayingRef.current = true;
        }
        return;
      }

      if (cfg.type === InteractivityActionType.playSegments && cfg.frames) {
        const startFrame = resolveFrame(cfg.frames[0], animationItem);
        const endFrame = resolveFrame(cfg.frames[1], animationItem);

        // Unsubscribe previous end-frame watcher
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }

        animationItem.goToAndPlay(startFrame, true);
        isPlayingRef.current = true;

        // Watch for reaching the end frame
        unsubscribeRef.current = target.subscribe(
          LottieSubscription.frame,
          ({ currentFrame }) => {
            if (currentFrame >= endFrame) {
              animationItem.goToAndStop(endFrame, true);
              isPlayingRef.current = false;
              countRef.current += 1;
              if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
              }
            }
          },
        );
        return;
      }

      if (cfg.type === InteractivityActionType.play) {
        target.play();
        isPlayingRef.current = true;
        // Track completion for count
        if (cfg.count != null) {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
          }
          unsubscribeRef.current = target.subscribe(
            LottieSubscription.complete,
            () => {
              countRef.current += 1;
              if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
              }
            },
          );
        }
      } else if (cfg.type === InteractivityActionType.stop) {
        target.stop();
        isPlayingRef.current = false;
      } else if (cfg.type === InteractivityActionType.seek && cfg.frames) {
        const frame = resolveFrame(cfg.frames[0], animationItem);
        animationItem.goToAndPlay(frame, true);
        isPlayingRef.current = true;
      }
    };

    container.addEventListener("click", handleClick);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      container.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.containerRef.current, target.animationItem, enabled]);
};
