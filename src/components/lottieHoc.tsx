import { LottiePlayer } from "lottie-web";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";

import {
  LottieProps,
  LottieRef,
  LottieState,
  LottieVersion,
  Direction,
  LottieSubscription,
} from "../@types";
import { PlayerState } from "../externals/player";
import { Player as ExternalPlayer } from "../externals/player/Player";
import { useLottieFactory } from "../hooks/useLottieFactory";

/**
 * V3 High Order Component to build an animation component
 *
 * Key changes in v3:
 * - Controls are OFF by default
 * - New `player` prop for player configuration
 * - External player handles both display and controls
 * - Subscription-based architecture for performance
 */
export const lottieHoc = <Version extends LottieVersion>(
  lottie: LottiePlayer,
) => {
  const Lottie: ForwardRefRenderFunction<LottieRef, LottieProps<Version>> = (
    props,
    ref,
  ) => {
    const { player, ...hookOptions } = props;

    // Initialize animation
    const { setContainerRef, ...lottieFactoryResult } =
      useLottieFactory<Version>(lottie, {
        ...hookOptions,
      });

    /**
     * Make the hook variables/methods available through the provided ref
     */
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

    // Convert internal state to player state (no currentFrame here!)
    const playerState: PlayerState = {
      isPlaying: state === LottieState.Playing,
      totalFrames,
      direction: direction === Direction.Right ? 1 : -1,
      loop: typeof loop === "boolean" ? loop : loop > 0,
      speed,
      isLoading: state === LottieState.Loading,
      hasError: state === LottieState.Failure,
    };

    // Create subscription functions for performance-critical updates
    const subscriptions = {
      frame: (callback: (currentFrame: number) => void) =>
        subscribe(
          LottieSubscription.Frame,
          ({ currentFrame }: { currentFrame: number }) => {
            callback(currentFrame);
          },
        ),
      state: (callback: (state: PlayerState) => void) =>
        subscribe(
          LottieSubscription.NewState,
          ({ state: newLottieState }: { state: LottieState }) => {
            // Convert LottieState to PlayerState format
            const convertedPlayerState: PlayerState = {
              isPlaying: newLottieState === LottieState.Playing,
              totalFrames,
              direction: direction === Direction.Right ? 1 : -1,
              loop: typeof loop === "boolean" ? loop : loop > 0,
              speed,
              isLoading: newLottieState === LottieState.Loading,
              hasError: newLottieState === LottieState.Failure,
            };
            callback(convertedPlayerState);
          },
        ),
    };

    // Convert internal actions to player actions
    const playerActions = {
      play,
      pause,
      stop,
      seek: (frame: number, isDraggingEnded?: boolean) => {
        seek(frame, isDraggingEnded ?? true);
      },
      changeSpeed,
      changeDirection: (dir: 1 | -1) => {
        changeDirection(dir === 1 ? Direction.Right : Direction.Left);
      },
      toggleLoop,
    };

    // Default overlays
    const defaultOverlays = {
      loading: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "14px",
          }}
        >
          Loading...
        </div>
      ),
      error: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff6b6b",
            fontSize: "14px",
          }}
        >
          Error loading animation
        </div>
      ),
    };

    // Use external player as the complete solution
    return (
      <ExternalPlayer
        ref={setContainerRef}
        state={playerState}
        subscriptions={subscriptions}
        actions={playerActions}
        theme={player?.theme}
        controls={player?.controls}
        responsive={player?.responsive}
        overlays={player?.overlays ?? defaultOverlays}
        show={true}
      />
    );
  };

  return forwardRef(Lottie);
};
