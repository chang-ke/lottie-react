import { AnimationItem, AnimationSegment, LottiePlayer } from "lottie-web";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import isEqual from "react-fast-compare";

import {
  InternalListener,
  LottieSubscriptions,
  UseLottieFactoryOptions,
  UseLottieFactoryResult,
  Direction,
  LottieRenderer,
  LottieState,
  LottieSubscription,
  LottieVersion,
} from "../types";
import getNumberFromNumberOrPercentage from "../utils/getNumberFromNumberOrPercentage";
import { createLogger } from "../utils/logger";
import normalizeAnimationSource from "../utils/normalizeAnimationSource";
import { SubscriptionManager } from "../utils/SubscriptionManager";

import useCallbackRef from "./useCallbackRef";
import useStateWithPrevious from "./useStateWithPrevious";

/**
 * Core animation factory hook.
 *
 * Accepts a lottie-web player instance so the same hook logic works for both
 * the full and the light (SVG-only) builds.
 */
export const useLottieFactory = <
  Version extends LottieVersion = typeof LottieVersion.full,
>(
  lottie: LottiePlayer,
  {
    src,
    enableReinitialize = false,
    debug = false,
    ...rest
  }: UseLottieFactoryOptions<Version>,
): UseLottieFactoryResult => {
  const options = { enableReinitialize, debug, ...rest };

  // Scoped logger — only active when `debug: true`
  const logger = useMemo(() => createLogger(debug), [debug]);

  // Callback ref — triggers a re-render when the container div is attached,
  // which is what kicks off animation (re)initialization.
  const { ref: containerRef, setRef: setContainerRef } =
    useCallbackRef<HTMLDivElement>();

  // Animation instance
  const [animationItem, setAnimationItem] = useState<AnimationItem | null>(
    null,
  );

  // Subscription manager — stable for the lifetime of the hook
  const subscriptionManager = useMemo(
    () => new SubscriptionManager<LottieSubscriptions>(),
    [],
  );

  // Animation state with previous-value tracking (used by seek to resume state)
  const { state, setState } = useStateWithPrevious<LottieState>({
    initialState: LottieState.loading,
    onChange: (_prev, newState) => {
      subscriptionManager.notify(LottieSubscription.newState, {
        state: newState,
      });
    },
  });

  // Ref-snapshot of initial values — stable reference, updated on each render
  const _initialValues = useRef(options.initialValues);

  // Local states derived from initialValues (owned by this hook after mount)
  const [loop, setLoop] = useState<boolean | number>(
    options.initialValues?.loop ?? false,
  );
  const [autoplay] = useState<boolean>(
    options.initialValues?.autoplay ?? false,
  );
  const [direction, setDirection] = useState<Direction>(
    options.initialValues?.direction ?? Direction.right,
  );
  const [speed, setSpeed] = useState<number>(options.initialValues?.speed ?? 1);
  const [initialSegment] = useState<AnimationSegment | undefined>(
    options.initialValues?.segment ?? undefined,
  );

  // Ref used by `seek` to restore playback state after a drag ends.
  // Using a ref (not state) avoids a stale-closure in the seek callback.
  const stateBeforeSeeking = useRef<LottieState | null>(null);

  // ─────────────────────────────────────────────────────────────────
  // (Re)initialize the animation when the container or source changes
  // ─────────────────────────────────────────────────────────────────
  useEffect(
    () => {
      logger.log("🪄 Trying to (re)initialize the animation");

      setState((prev) =>
        prev === LottieState.loading ? prev : LottieState.loading,
      );

      if (!containerRef.current) {
        logger.log("⌛️ Container not ready yet");
        return;
      }

      // Destroy any previous instance before creating a new one
      if (animationItem) {
        logger.log("🗑 Destroying previous animation instance");
        animationItem.destroy();
      }

      const normalizedSource = normalizeAnimationSource(src);
      if (!normalizedSource) {
        logger.log("😥 Animation source is invalid");
        subscriptionManager.notify(LottieSubscription.failure, undefined);
        setState((prev) =>
          prev === LottieState.failure ? prev : LottieState.failure,
        );
        return;
      }

      let _animationItem: AnimationItem;
      try {
        _animationItem = lottie.loadAnimation({
          ...normalizedSource,
          container: containerRef.current,
          renderer: options.renderer ?? LottieRenderer.svg,
          rendererSettings: options.rendererSettings,
          loop,
          autoplay,
          initialSegment,
          assetsPath: _initialValues.current?.assetsPath,
        });
      } catch (e) {
        logger.warn("⚠️ Error loading animation", e);
        subscriptionManager.notify(LottieSubscription.failure, undefined);
        setState((prev) =>
          prev === LottieState.failure ? prev : LottieState.failure,
        );
        return;
      }

      logger.log("👌 Animation initialized", _animationItem);
      setAnimationItem(_animationItem);

      // Register lottie-web event → subscription bridge
      const internalListeners: InternalListener[] = [
        {
          name: "complete",
          handler: () => {
            _animationItem.goToAndStop(0);
            setState(LottieState.stopped);
            subscriptionManager.notify(LottieSubscription.complete, undefined);
          },
        },
        {
          name: "loopComplete",
          handler: () => {
            subscriptionManager.notify(
              LottieSubscription.loopCompleted,
              undefined,
            );
          },
        },
        {
          name: "enterFrame",
          handler: () => {
            subscriptionManager.notify(LottieSubscription.frame, {
              currentFrame: _animationItem.currentFrame,
            });
          },
        },
        { name: "segmentStart", handler: () => undefined },
        { name: "config_ready", handler: () => undefined },
        {
          name: "data_ready",
          handler: () => {
            subscriptionManager.notify(LottieSubscription.ready, undefined);
          },
        },
        {
          name: "data_failed",
          handler: () => {
            setState(LottieState.failure);
          },
        },
        { name: "loaded_images", handler: () => undefined },
        {
          name: "DOMLoaded",
          handler: () => {
            setState(
              _animationItem.autoplay
                ? LottieState.playing
                : LottieState.stopped,
            );
          },
        },
        { name: "destroy", handler: () => undefined },
      ];

      const removers = internalListeners.map((l) => {
        try {
          _animationItem.addEventListener(l.name, l.handler);
        } catch (e) {
          logger.warn(
            `⚠️ Could not register internal listener "${l.name}"`,
            e,
          );
        }
        return () => {
          try {
            _animationItem.removeEventListener(l.name, l.handler);
          } catch (e) {
            logger.warn(
              `⚠️ Could not deregister internal listener "${l.name}"`,
              e,
            );
          }
        };
      });

      logger.log("👂 Internal listeners registered");

      return () => {
        logger.log("🧹 Cleaning up animation...");
        removers.forEach((r) => { r(); });
        _animationItem.destroy();
        setAnimationItem(null);
      };
    },
    // Intentionally narrow deps: only re-initialize when the container div or
    // the animation source changes — other props are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerRef.current, src],
  );

  // ─────────────────────────────────────────────────────────────────
  // React to initialValues changes (only when enableReinitialize=true)
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (
      !animationItem ||
      !enableReinitialize ||
      isEqual(_initialValues.current, options.initialValues)
    ) {
      return;
    }

    _initialValues.current = options.initialValues;

    // Loop
    setLoop((prev) => {
      const next = _initialValues.current?.loop ?? false;
      if (next === prev) return prev;
      animationItem.loop = next;
      return next;
    });

    // Direction
    setDirection((prev) => {
      const next =
        _initialValues.current?.direction ?? Direction.right;
      if (next === prev) return prev;
      animationItem.setDirection(next === Direction.right ? 1 : -1);
      return next;
    });

    // Speed
    setSpeed((prev) => {
      const next = _initialValues.current?.speed ?? 1;
      if (next === prev) return prev;
      animationItem.setSpeed(next);
      return next;
    });
  }, [animationItem, enableReinitialize, options.initialValues]);

  // ─────────────────────────────────────────────────────────────────
  // Consumer subscriptions — ref-forwarding pattern
  //
  // We register stable "forwarding" handlers once per subscription type.
  // The ref is updated every render so handlers always call the latest
  // callback without needing to re-register.
  // ─────────────────────────────────────────────────────────────────

  // Keep the latest subscriptions in a ref so forwarding handlers can
  // always call the most-recent callback.
  const _subscriptionsRef = useRef(options.subscriptions);
  // Update synchronously (not in useEffect) so the ref is current
  // during the same render cycle.
  _subscriptionsRef.current = options.subscriptions;

  // Derive a stable key from the set of subscribed event types.
  // We only re-register when the set of types changes, not when handlers change.
  const subscriptionTypesKey = Object.keys(options.subscriptions ?? {})
    .sort()
    .join(",");

  useEffect(() => {
    const subscriptions = _subscriptionsRef.current;
    if (!subscriptions || Object.keys(subscriptions).length === 0) return;

    const keys = Object.keys(subscriptions) as (keyof LottieSubscriptions)[];

    // Create one stable forwarding handler per subscription type.
    const unsubscribers = keys.map((key) =>
      subscriptionManager.subscribe(
        key,
        ((...args: Parameters<LottieSubscriptions[typeof key]>) => {
          // Always calls the latest handler from the ref
          (
            _subscriptionsRef.current?.[key] as
              | ((...a: Parameters<LottieSubscriptions[typeof key]>) => void)
              | undefined
          )?.(...args);
        }) as LottieSubscriptions[typeof key],
      ),
    );

    logger.log("👂 Consumer subscriptions registered");

    return () => {
      logger.log("🧹 Unregistering consumer subscriptions");
      unsubscribers.forEach((fn) => { fn(); });
    };
    // Re-register only when the set of subscribed event types changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionManager, subscriptionTypesKey]);

  // ─────────────────────────────────────────────────────────────────
  // Interaction methods
  // ─────────────────────────────────────────────────────────────────

  const play = useCallback(() => {
    if (!animationItem) return;
    if (animationItem.currentFrame <= 0 && direction === Direction.left) {
      animationItem.goToAndPlay(animationItem.totalFrames, true);
    } else {
      animationItem.play();
    }
    setState(LottieState.playing);
    subscriptionManager.notify(LottieSubscription.play, undefined);
  }, [animationItem, direction, setState, subscriptionManager]);

  const pause = useCallback(() => {
    if (!animationItem) return;
    animationItem.pause();
    setState(LottieState.paused);
    subscriptionManager.notify(LottieSubscription.pause, undefined);
  }, [animationItem, subscriptionManager, setState]);

  const stop = useCallback(() => {
    if (!animationItem) return;
    animationItem.goToAndStop(0);
    setState(LottieState.stopped);
    subscriptionManager.notify(LottieSubscription.stop, undefined);
  }, [animationItem, subscriptionManager, setState]);

  const toggleLoop = useCallback(() => {
    if (!animationItem) return;
    animationItem.loop = !animationItem.loop;
    setLoop(animationItem.loop);
  }, [animationItem]);

  const changeDirection = useCallback(
    (dir: Direction) => {
      if (!animationItem) return;
      setDirection(dir);
      animationItem.setDirection(dir === Direction.right ? 1 : -1);
    },
    [animationItem],
  );

  const changeSpeed = useCallback(
    (newSpeed: number) => {
      if (!animationItem) return;
      setSpeed(newSpeed);
      animationItem.setSpeed(newSpeed);
    },
    [animationItem],
  );

  /**
   * Seek to a frame or percentage.
   * @param value - Frame number or percentage string (e.g. "50%")
   * @param isSeekingEnded - `true` when the drag/seek gesture has ended
   */
  const seek = useCallback(
    (value: number | string, isSeekingEnded: boolean) => {
      if (!animationItem) return;

      const seekInfo = getNumberFromNumberOrPercentage(value);
      if (!seekInfo) return;

      const frame = seekInfo.isPercentage
        ? (animationItem.totalFrames * seekInfo.number) / 100
        : seekInfo.number;

      setState((prevState) => {
        // Remember the pre-seek state so we can resume it when seeking ends.
        // Uses a ref to avoid stale closures in nested setState calls.
        if (!isSeekingEnded && stateBeforeSeeking.current === null) {
          stateBeforeSeeking.current = prevState;
        } else if (isSeekingEnded) {
          stateBeforeSeeking.current = null;
        }

        const shouldPlayAfter =
          isSeekingEnded &&
          (prevState === LottieState.playing ||
            stateBeforeSeeking.current === LottieState.playing);

        if (shouldPlayAfter) {
          animationItem.goToAndPlay(frame, true);
          return LottieState.playing;
        }

        animationItem.goToAndStop(frame, true);

        if (prevState !== LottieState.stopped) {
          if (isSeekingEnded && frame === 0) return LottieState.stopped;
          return LottieState.paused;
        }

        return prevState;
      });
    },
    [animationItem, setState],
  );

  return {
    containerRef,
    setContainerRef,
    animationItem,
    state,
    subscribe: subscriptionManager.subscribe,
    totalFrames: animationItem?.totalFrames ?? 0,
    direction,
    loop,
    play,
    pause,
    stop,
    toggleLoop,
    changeDirection,
    speed,
    changeSpeed,
    seek,
  };
};
