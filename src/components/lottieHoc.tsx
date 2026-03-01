import { LottiePlayer } from "lottie-web";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";

import { useLottieFactory } from "../hooks/useLottieFactory";
import { InteractivityBridge } from "../interactivity/InteractivityBridge";
import { PlayerState } from "../player";
import { Player as ExternalPlayer } from "../player/Player";
import {
  LottieProps,
  LottieRef,
  LottieState,
  LottieVersion,
  Direction,
  LottieSubscription,
} from "../types";

/**
 * High Order Component that binds the animation factory hook to the Player.
 *
 * Key v3 design decisions:
 * - Controls are OFF by default (clean API, opt-in)
 * - Subscription-based architecture for performance (no re-renders on frame)
 * - Player handles both display and controls
 */
export const lottieHoc = <Version extends LottieVersion>(
  lottie: LottiePlayer,
) => {
  const Lottie: ForwardRefRenderFunction<LottieRef, LottieProps<Version>> = (
    props,
    ref,
  ) => {
    const { player, interactivity, ...hookOptions } = props;

    const { setContainerRef, ...lottieFactoryResult } =
      useLottieFactory<Version>(lottie, hookOptions);

    useImperativeHandle(ref, () => lottieFactoryResult);

    const {
      state,
      totalFrames,
      direction,
      loop,
      play,
      pause,
      stop,
      toggleLoop,
      speed,
      changeSpeed,
      changeDirection,
      seek,
      subscribe,
    } = lottieFactoryResult;

    // Convert internal state to the Player's flat state shape.
    // currentFrame is intentionally omitted — it's subscription-only for performance.
    const playerState: PlayerState = {
      isPlaying: state === LottieState.playing,
      totalFrames,
      direction: direction === Direction.right ? 1 : -1,
      loop: typeof loop === "boolean" ? loop : loop > 0,
      speed,
      isLoading: state === LottieState.loading,
      hasError: state === LottieState.failure,
    };

    // Subscription bridges — forward internal subscriptions in the Player's shape
    const subscriptions = {
      frame: (callback: (currentFrame: number) => void) =>
        subscribe(LottieSubscription.frame, ({ currentFrame }) => {
          callback(currentFrame);
        }),
      state: (callback: (s: PlayerState) => void) =>
        subscribe(
          LottieSubscription.newState,
          ({ state: newState }: { state: LottieState }) => {
            callback({
              isPlaying: newState === LottieState.playing,
              totalFrames,
              direction: direction === Direction.right ? 1 : -1,
              loop: typeof loop === "boolean" ? loop : loop > 0,
              speed,
              isLoading: newState === LottieState.loading,
              hasError: newState === LottieState.failure,
            });
          },
        ),
    };

    // Adapt internal action signatures to the Player's action interface
    const playerActions = {
      play,
      pause,
      stop,
      seek: (frame: number, isDraggingEnded?: boolean) => {
        seek(frame, isDraggingEnded ?? true);
      },
      changeSpeed,
      changeDirection: (dir: 1 | -1) => {
        changeDirection(dir === 1 ? Direction.right : Direction.left);
      },
      toggleLoop,
    };

    return (
      <>
        <ExternalPlayer
          ref={setContainerRef}
          state={playerState}
          subscriptions={subscriptions}
          actions={playerActions}
          theme={player?.theme}
          controls={player?.controls}
          responsive={player?.responsive}
          overlays={player?.overlays}
        />
        {interactivity && (
          <InteractivityBridge
            target={lottieFactoryResult}
            config={interactivity}
          />
        )}
      </>
    );
  };

  return forwardRef(Lottie);
};
