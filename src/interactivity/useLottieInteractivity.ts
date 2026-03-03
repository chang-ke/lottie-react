import { useCallback, useState } from "react";

import { useChainMode } from "./modes/useChainMode";
import { useClickMode } from "./modes/useClickMode";
import { useCursorMode } from "./modes/useCursorMode";
import { useHoverMode } from "./modes/useHoverMode";
import { useScrollMode } from "./modes/useScrollMode";
import {
  InteractivityConfig,
  InteractivityMode,
  InteractivityTarget,
  UseLottieInteractivityResult,
} from "./types";

/**
 * Attaches interactivity behaviour (scroll / cursor / hover / click / chain)
 * to a Lottie animation.
 *
 * @param target   — narrowed subset of a UseLottieFactoryResult
 * @param config   — discriminated union describing the desired mode
 */
export const useLottieInteractivity = (
  target: InteractivityTarget,
  config: InteractivityConfig,
): UseLottieInteractivityResult => {
  const [isActive, setIsActive] = useState(true);

  const enable = useCallback(() => {
    setIsActive(true);
  }, []);
  const disable = useCallback(() => {
    setIsActive(false);
  }, []);

  // Each mode hook is always called (Rules of Hooks), but only activated
  // when the mode matches and isActive is true.

  const isScroll = config.mode === InteractivityMode.scroll && isActive;
  const isCursor = config.mode === InteractivityMode.cursor && isActive;
  const isHover = config.mode === InteractivityMode.hover && isActive;
  const isClick = config.mode === InteractivityMode.click && isActive;
  const isChain = config.mode === InteractivityMode.chain && isActive;

  useScrollMode(
    target,
    config.mode === InteractivityMode.scroll
      ? config
      : { mode: InteractivityMode.scroll, actions: [] },
    isScroll,
  );

  useCursorMode(
    target,
    config.mode === InteractivityMode.cursor
      ? config
      : { mode: InteractivityMode.cursor, actions: [] },
    isCursor,
  );

  useHoverMode(
    target,
    config.mode === InteractivityMode.hover
      ? config
      : { mode: InteractivityMode.hover },
    isHover,
  );

  useClickMode(
    target,
    config.mode === InteractivityMode.click
      ? config
      : {
          mode: InteractivityMode.click,
          type: InteractivityMode.click as never,
        },
    isClick,
  );

  const chainResult = useChainMode(
    target,
    config.mode === InteractivityMode.chain
      ? config
      : { mode: InteractivityMode.chain, states: [] },
    isChain,
  );

  return {
    isActive,
    currentChainState: chainResult.currentChainState,
    goToChainState: chainResult.goToChainState,
    disable,
    enable,
  };
};
