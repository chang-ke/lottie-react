import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

import { Display } from "./components/Display";
import { FrameIndicator } from "./components/FrameIndicator";
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
import { mergeTheme, isMobile } from "./utils/PlayerTheme";
import { useFullscreen } from "./utils/useFullscreen";

/**
 * Completely isolated Player component
 * No external dependencies - everything is passed via props
 * Highly customizable and performant
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

  // Use internal fullscreen hook
  const { isFullscreen, toggleFullscreen } = useFullscreen(fullscreenRef);

  const mergedTheme = mergeTheme(theme);
  const mergedElements = useMemo(() => {
    if (controls === false) {
      // Controls disabled, return all false
      return Object.keys(DEFAULT_PLAYER_ELEMENTS).reduce((acc, key) => {
        acc[key as keyof PlayerElements] = false;
        return acc;
      }, {} as PlayerElements);
    }
    if (controls === true) {
      // Controls enabled with defaults
      return DEFAULT_PLAYER_ELEMENTS;
    }
    // Custom controls configuration - full control, no defaults merged
    return controls;
  }, [controls]);
  const mergedResponsive = useMemo(
    () => ({ ...DEFAULT_PLAYER_RESPONSIVE, ...responsive }),
    [responsive],
  );

  // Handle window resize for responsive behavior
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

  /**
   * Checks if an element should be shown based on user preferences and responsive logic
   */
  const shouldShowElement = useCallback(
    (element: keyof PlayerElements) => {
      // First, check if an element is enabled
      if (!mergedElements[element]) return false;

      // If responsive is disabled, show all enabled elements
      if (!mergedResponsive.enabled) return true;

      // Check if we're in mobile view
      const isMobileView =
        mergedResponsive.compact ||
        isMobile(screenWidth, mergedResponsive.breakpoint);

      // If mobile and this element should be hidden on mobile, return false
      return !(isMobileView && mergedResponsive.hideOnMobile[element]);
    },
    [mergedElements, mergedResponsive, screenWidth],
  );

  const handleDirectionClick = useCallback(() => {
    const newDirection = state.direction === 1 ? -1 : 1;
    actions.changeDirection(newDirection);
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

  if (!show) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: mergedTheme.sizing.height,
    padding: `0 ${String(mergedTheme.spacing.padding ?? 0)}px`,
    backgroundColor: mergedTheme.colors.background,
    borderRadius: mergedResponsive.compact
      ? 0
      : mergedTheme.sizing.borderRadius,
    backdropFilter: mergedTheme.effects.backdropBlur ? "blur(8px)" : "none",
    gap: mergedTheme.spacing.gap,
    flexWrap: "nowrap",
    overflow: "visible",
    transition: mergedTheme.effects.transitions ? "all 200ms ease" : "none",
    zIndex: 100,
    boxShadow: mergedTheme.effects.shadows
      ? "0 2px 8px rgba(0, 0, 0, 0.2)"
      : "none",
    ...style,
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
    gap: Math.round((mergedTheme.spacing.gap ?? 8) * 0.5),
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

      {/* Loading overlay */}
      {state.isLoading && overlays?.loading && (
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
          {overlays.loading}
        </div>
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

      {/* Controls container - only show when not loading/error */}
      {!state.isLoading && !state.hasError && (
        <div
          style={containerStyle}
          role="toolbar"
          aria-label="Animation controls"
        >
          {/* Primary playback controls */}
          <div style={controlGroupStyle}>
            {shouldShowElement("playPause") && !state.isPlaying && (
              <PlayButton onClick={actions.play} theme={theme} />
            )}

            {shouldShowElement("playPause") && state.isPlaying && (
              <PauseButton onClick={actions.pause} theme={theme} />
            )}

            {shouldShowElement("stop") && (
              <StopButton onClick={actions.stop} theme={theme} />
            )}
          </div>

          {/* Progress bar - always flexible */}
          {shouldShowElement("progressBar") && (
            <>
              <div style={dividerStyle} />
              <div style={progressContainerStyle}>
                <ProgressBar
                  totalFrames={state.totalFrames}
                  subscribeToFrame={subscriptions.frame}
                  onChange={handleProgressChange}
                  theme={theme}
                />
              </div>
              <div style={dividerStyle} />
            </>
          )}

          {/* Secondary controls */}
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
              />
            )}

            {shouldShowElement("direction") && (
              <DirectionButton
                direction={state.direction}
                onClick={handleDirectionClick}
                theme={theme}
              />
            )}

            {shouldShowElement("speed") && (
              <SpeedButton
                speed={state.speed}
                speeds={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]}
                onSpeedChange={handleSpeedChange}
                theme={theme}
              />
            )}

            {shouldShowElement("fullscreen") && toggleFullscreen && (
              <FullscreenButton
                isFullscreen={isFullscreen}
                onClick={toggleFullscreen}
                theme={theme}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Player = forwardRef(PlayerWithRef);
