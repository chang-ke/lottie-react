import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { Display } from "./components/Display";
import { FrameIndicator } from "./components/FrameIndicator";
import { LoadingOverlay } from "./components/LoadingOverlay";
import {
  PlayButton,
  PauseButton,
  StopButton,
  LoopButton,
  DirectionButton,
  SpeedButton,
  FullscreenButton,
} from "./components/PlayerButtons";
import { ProgressBar } from "./components/ProgressBar";
import {
  PlayerProps,
  PlayerElements,
  DEFAULT_PLAYER_ELEMENTS,
  DEFAULT_PLAYER_RESPONSIVE,
} from "./types";
import { mergeTheme, isMobile, processLoadingConfig } from "./utils/PlayerTheme";
import { useFullscreen } from "./utils/useFullscreen";

/**
 * Completely isolated Player component.
 * No external dependencies — everything is passed via props.
 *
 * Design notes:
 * - A single resize listener on the Player propagates `screenWidth` to buttons
 *   (avoids N independent window listeners for N buttons).
 * - Keyboard shortcuts (k / l / f) fire when the player container is focused.
 * - `style` applies only to the outer wrapper; the controls bar has its own
 *   internal styles.
 * - Loading overlay is opt-in: pass `overlays.loading` to enable it.
 */
const PlayerWithRef: ForwardRefRenderFunction<HTMLDivElement, PlayerProps> = (
  {
    state,
    subscriptions,
    actions,
    theme,
    controls = false,
    responsive = DEFAULT_PLAYER_RESPONSIVE,
    overlays,
    className,
    style,
    show = true,
  },
  ref,
) => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  // Internal fullscreen ref for the entire player container
  const fullscreenRef = useRef<HTMLDivElement>(null);

  const { isFullscreen, toggleFullscreen } = useFullscreen(fullscreenRef);

  const mergedTheme = mergeTheme(theme);
  const mergedElements = useMemo(() => {
    if (controls === false) {
      return Object.keys(DEFAULT_PLAYER_ELEMENTS).reduce<PlayerElements>(
        (acc, key) => {
          acc[key as keyof PlayerElements] = false;
          return acc;
        },
        {},
      );
    }
    if (controls === true) {
      return DEFAULT_PLAYER_ELEMENTS;
    }
    return controls;
  }, [controls]);

  const mergedResponsive = useMemo(
    () => ({ ...DEFAULT_PLAYER_RESPONSIVE, ...responsive }),
    [responsive],
  );

  // Single resize listener — propagates to all buttons via screenWidth prop
  useEffect(() => {
    if (typeof window === "undefined" || !mergedResponsive.enabled) return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mergedResponsive.enabled]);

  const shouldShowElement = useCallback(
    (element: keyof PlayerElements) => {
      if (!mergedElements[element]) return false;
      if (!mergedResponsive.enabled) return true;

      const isMobileView =
        mergedResponsive.compact ||
        isMobile(screenWidth, mergedResponsive.breakpoint);

      return !(isMobileView && mergedResponsive.hideOnMobile[element]);
    },
    [mergedElements, mergedResponsive, screenWidth],
  );

  const handleDirectionClick = useCallback(() => {
    actions.changeDirection(state.direction === 1 ? -1 : 1);
  }, [state.direction, actions]);

  const handleSpeedChange = useCallback(
    (speed: number) => {
      actions.changeSpeed(speed);
    },
    [actions],
  );

  const handleProgressChange = useCallback(
    (frame: number, isDraggingEnded?: boolean) => {
      actions.seek(frame, isDraggingEnded);
    },
    [actions],
  );

  // Keyboard shortcuts: k=play/pause, l=loop, f=fullscreen
  // Uses document-level listener (no tabIndex/role needed on the container div).
  // Ref pattern: handler is re-assigned each render so it always closes over the
  // latest state, but the listener is only registered once.
  const isPlayerFocusedRef = useRef(false);
  const keyboardHandlerRef = useRef<(e: KeyboardEvent) => void>(() => undefined);
  keyboardHandlerRef.current = (e: KeyboardEvent) => {
    if (!isPlayerFocusedRef.current) return;
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    switch (e.key.toLowerCase()) {
      case "k":
        e.preventDefault();
        if (state.isPlaying) {
          actions.pause();
        } else {
          actions.play();
        }
        break;
      case "l":
        e.preventDefault();
        actions.toggleLoop();
        break;
      case "f":
        e.preventDefault();
        if (toggleFullscreen) void toggleFullscreen();
        break;
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      keyboardHandlerRef.current(e);
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); };
  }, []);

  const hasAnyControls = useMemo(() => {
    return Object.keys(DEFAULT_PLAYER_ELEMENTS).some((key) =>
      shouldShowElement(key as keyof PlayerElements),
    );
  }, [shouldShowElement]);

  // Compute primary and secondary group visibility to avoid orphaned dividers
  const hasPrimaryControls = useMemo(
    () => shouldShowElement("playPause") || shouldShowElement("stop"),
    [shouldShowElement],
  );

  const hasSecondaryControls = useMemo(
    () =>
      shouldShowElement("frameIndicator") ||
      shouldShowElement("loop") ||
      shouldShowElement("direction") ||
      shouldShowElement("speed") ||
      (shouldShowElement("fullscreen") && !!toggleFullscreen),
    [shouldShowElement, toggleFullscreen],
  );

  const loadingConfig = useMemo(
    () => processLoadingConfig(overlays?.loading),
    [overlays?.loading],
  );

  if (!show) {
    return null;
  }

  // Controls bar style — does NOT inherit user's `style` prop (that belongs to the outer wrapper)
  const controlsBarStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: mergedTheme.sizing.height,
    padding: `0 ${String(mergedTheme.spacing.padding)}px`,
    backgroundColor: mergedTheme.colors.background,
    borderRadius: mergedResponsive.compact ? 0 : mergedTheme.sizing.borderRadius,
    backdropFilter: mergedTheme.effects.backdropBlur ? "blur(8px)" : "none",
    gap: mergedTheme.spacing.gap,
    flexWrap: "nowrap",
    overflow: "visible",
    transition: mergedTheme.effects.transitions ? "all 200ms ease" : "none",
    zIndex: 100,
    boxShadow: mergedTheme.effects.shadows ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none",
  };

  const progressContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  };

  const controlGroupStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: Math.round(mergedTheme.spacing.gap * 0.5),
  };

  const dividerStyle: React.CSSProperties = {
    width: 1,
    height: 16,
    backgroundColor: mergedTheme.colors.border,
    opacity: 0.5,
  };

  return (
    <div
      ref={fullscreenRef}
      onFocus={() => {
        isPlayerFocusedRef.current = true;
      }}
      onBlur={(e) => {
        if (!fullscreenRef.current?.contains(e.relatedTarget as Node)) {
          isPlayerFocusedRef.current = false;
        }
      }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        ...style,
      }}
      className={className}
    >
      {/* Display area for content - ALWAYS render so setContainerRef works */}
      <Display ref={ref} theme={theme} style={{ flex: 1 }} />

      {/* Loading overlay - always render so it can fade out */}
      {loadingConfig && (
        <LoadingOverlay show={state.isLoading} config={loadingConfig} />
      )}

      {/* Error overlay */}
      {state.hasError && overlays?.error && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
          }}
        >
          {overlays.error}
        </div>
      )}

      {/* Controls bar */}
      {!state.isLoading && !state.hasError && hasAnyControls && (
        <div
          style={controlsBarStyle}
          role="toolbar"
          aria-label="Animation controls"
        >
          {/* Primary playback controls */}
          {hasPrimaryControls && (
            <div style={controlGroupStyle}>
              {shouldShowElement("playPause") && !state.isPlaying && (
                <PlayButton onClick={actions.play} theme={theme} screenWidth={screenWidth} />
              )}

              {shouldShowElement("playPause") && state.isPlaying && (
                <PauseButton onClick={actions.pause} theme={theme} screenWidth={screenWidth} />
              )}

              {shouldShowElement("stop") && (
                <StopButton onClick={actions.stop} theme={theme} screenWidth={screenWidth} />
              )}
            </div>
          )}

          {/* Left divider: only if primary group has content */}
          {shouldShowElement("progressBar") && hasPrimaryControls && (
            <div style={dividerStyle} />
          )}

          {/* Progress bar */}
          {shouldShowElement("progressBar") && (
            <div style={progressContainerStyle}>
              <ProgressBar
                totalFrames={state.totalFrames}
                subscribeToFrame={subscriptions.frame}
                onChange={handleProgressChange}
                theme={theme}
              />
            </div>
          )}

          {/* Right divider: only if secondary group has content */}
          {shouldShowElement("progressBar") && hasSecondaryControls && (
            <div style={dividerStyle} />
          )}

          {/* Secondary controls */}
          {hasSecondaryControls && (
            <div style={controlGroupStyle}>
              {shouldShowElement("frameIndicator") && (
                <FrameIndicator
                  totalFrames={state.totalFrames || 0}
                  subscribeToFrame={subscriptions.frame}
                  decimals={0}
                  showTotal={!mergedResponsive.compact}
                  theme={theme}
                />
              )}

              {shouldShowElement("loop") && (
                <LoopButton
                  isOn={!!state.loop}
                  onClick={actions.toggleLoop}
                  theme={theme}
                  screenWidth={screenWidth}
                />
              )}

              {shouldShowElement("direction") && (
                <DirectionButton
                  direction={state.direction}
                  onClick={handleDirectionClick}
                  theme={theme}
                  screenWidth={screenWidth}
                />
              )}

              {shouldShowElement("speed") && (
                <SpeedButton
                  speed={state.speed}
                  speeds={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]}
                  onSpeedChange={handleSpeedChange}
                  theme={theme}
                  screenWidth={screenWidth}
                />
              )}

              {shouldShowElement("fullscreen") && toggleFullscreen && (
                <FullscreenButton
                  isFullscreen={isFullscreen}
                  onClick={toggleFullscreen}
                  theme={theme}
                  screenWidth={screenWidth}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const Player = forwardRef(PlayerWithRef);
