import { useCallback, useEffect, useRef, useState } from "react";

import { LottieSubscription } from "../../types";
import {
  ChainConfig,
  ChainState,
  ChainTransitionType,
  InteractivityActionType,
  InteractivityTarget,
} from "../types";
import { resolveFrame } from "../utils/resolveFrames";

export interface ChainModeResult {
  currentChainState: string | null;
  goToChainState: (name: string) => void;
}

export const useChainMode = (
  target: InteractivityTarget,
  config: ChainConfig,
  enabled: boolean,
): ChainModeResult => {
  const configRef = useRef(config);
  configRef.current = config;

  const targetRef = useRef(target);
  targetRef.current = target;

  const [currentChainState, setCurrentChainState] = useState<string | null>(
    config.initialState ?? config.states.at(0)?.name ?? null,
  );

  // Cleanup functions for the active state's transition listeners
  const cleanupRef = useRef<(() => void)[]>([]);

  // Ref so `advance` always calls the latest enterState (avoids stale closures)
  const enterStateRef = useRef<(name: string) => void>(() => undefined);

  const enterState = useCallback((stateName: string) => {
    const { animationItem, containerRef, play, pause, stop, subscribe } =
      targetRef.current;
    if (!animationItem) return;

    const cfg = configRef.current;
    const state: ChainState | undefined = cfg.states.find(
      (s) => s.name === stateName,
    );
    if (!state) return;

    // Tear down previous state listeners
    cleanupRef.current.forEach((fn) => {
      fn();
    });
    cleanupRef.current = [];

    setCurrentChainState(stateName);

    // Apply speed
    if (state.speed != null) animationItem.setSpeed(state.speed);

    // Apply animation action
    const frames = state.frames;

    // forceFlag: always restart from start frame on enter
    if (state.forceFlag) {
      const startFrame = frames ? resolveFrame(frames[0], animationItem) : 0;
      animationItem.goToAndStop(startFrame, true);
    }

    if (state.type === InteractivityActionType.seek && frames) {
      animationItem.goToAndStop(resolveFrame(frames[0], animationItem), true);
    } else if (state.type === InteractivityActionType.play) {
      if (frames) {
        animationItem.playSegments(
          [
            resolveFrame(frames[0], animationItem),
            resolveFrame(frames[1], animationItem),
          ],
          true,
        );
      } else {
        animationItem.loop = state.loop ?? false;
        play();
      }
    } else if (state.type === InteractivityActionType.loop) {
      animationItem.loop = true;
      if (frames) {
        animationItem.playSegments(
          [
            resolveFrame(frames[0], animationItem),
            resolveFrame(frames[1], animationItem),
          ],
          true,
        );
      } else {
        play();
      }
    } else if (state.type === InteractivityActionType.stop) {
      stop();
    }

    // Advance to the next state (resolves target/next from config at call time)
    const advance = () => {
      const { states, loop: cfgLoop } = configRef.current;
      const idx = states.findIndex((s) => s.name === stateName);
      const targetName = state.transition.target;
      if (targetName) {
        enterStateRef.current(targetName);
      } else if (idx + 1 < states.length) {
        enterStateRef.current(states[idx + 1].name);
      } else if (cfgLoop && states.length > 0) {
        enterStateRef.current(states[0].name);
      }
    };

    const container = containerRef.current;
    const { transition } = state;

    if (transition.type === ChainTransitionType.onComplete) {
      const unsub = subscribe(LottieSubscription.complete, advance);
      cleanupRef.current.push(unsub);
    } else if (transition.type === ChainTransitionType.click) {
      if (container) {
        const required = transition.count ?? 1;
        let clicks = 0;
        const onClick = () => {
          clicks += 1;
          if (clicks >= required) advance();
        };
        container.addEventListener("click", onClick);
        cleanupRef.current.push(() => {
          container.removeEventListener("click", onClick);
        });
      }
    } else if (transition.type === ChainTransitionType.hover) {
      if (container) {
        const required = transition.count ?? 1;
        let hovers = 0;
        const onEnter = () => {
          hovers += 1;
          if (hovers >= required) advance();
        };
        container.addEventListener("mouseenter", onEnter);
        cleanupRef.current.push(() => {
          container.removeEventListener("mouseenter", onEnter);
        });
      }
    } else if (transition.type === ChainTransitionType.repeat) {
      const targetCount = transition.count ?? 1;
      let repeatCount = 0;
      const unsub = subscribe(LottieSubscription.loopCompleted, () => {
        repeatCount += 1;
        if (repeatCount >= targetCount) advance();
      });
      cleanupRef.current.push(unsub);
    } else if (transition.type === ChainTransitionType.hold) {
      if (container) {
        const onDown = () => {
          play();
        };
        const onUp = () => {
          pause();
        };
        container.addEventListener("mousedown", onDown);
        container.addEventListener("mouseup", onUp);
        cleanupRef.current.push(() => {
          container.removeEventListener("mousedown", onDown);
          container.removeEventListener("mouseup", onUp);
        });
      }
    } else if (transition.type === ChainTransitionType.pauseHold) {
      if (container) {
        const onDown = () => {
          pause();
        };
        const onUp = () => {
          play();
        };
        container.addEventListener("mousedown", onDown);
        container.addEventListener("mouseup", onUp);
        cleanupRef.current.push(() => {
          container.removeEventListener("mousedown", onDown);
          container.removeEventListener("mouseup", onUp);
        });
      }
    } else if (transition.type === ChainTransitionType.none) {
      // Stay in this state indefinitely — no transition listener
    } else if (transition.type === ChainTransitionType.cursorSync) {
      // Cursor X position (0→1) maps to frames — seeking within state frames
      if (container) {
        const onMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          const x = Math.min(
            Math.max((e.clientX - rect.left) / rect.width, 0),
            1,
          );
          const stateFrames = state.frames;
          const startFrame = stateFrames
            ? resolveFrame(stateFrames[0], animationItem)
            : 0;
          const endFrame = stateFrames
            ? resolveFrame(stateFrames[1], animationItem)
            : animationItem.totalFrames - 1;
          const frame = Math.round(startFrame + x * (endFrame - startFrame));
          animationItem.goToAndStop(frame, true);
        };
        container.addEventListener("mousemove", onMove);
        cleanupRef.current.push(() => {
          container.removeEventListener("mousemove", onMove);
        });
      }
    } else {
      // ChainTransitionType.delay
      const delay = transition.delay ?? 0;
      const timerId = setTimeout(advance, delay);
      cleanupRef.current.push(() => {
        clearTimeout(timerId);
      });
    }
    // No deps — reads everything via refs (targetRef, configRef, enterStateRef)
  }, []);

  // Always keep the ref in sync with the latest function
  enterStateRef.current = enterState;

  // Enter initial state when animation is ready
  useEffect(() => {
    if (!enabled || !target.animationItem) return;

    const initial =
      configRef.current.initialState ?? configRef.current.states[0]?.name;
    if (initial) enterStateRef.current(initial);

    return () => {
      cleanupRef.current.forEach((fn) => {
        fn();
      });
      cleanupRef.current = [];
    };
  }, [target.animationItem, enabled]);

  const goToChainState = useCallback(
    (name: string) => {
      if (!enabled) return;
      enterStateRef.current(name);
    },
    [enabled],
  );

  return { currentChainState, goToChainState };
};
