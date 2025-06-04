import { forwardRef, ForwardRefRenderFunction, useState, useEffect, useCallback, useRef } from "react";
import {
  PlayerProps,
  PlayerElements,
  DEFAULT_PLAYER_ELEMENTS,
  DEFAULT_PLAYER_RESPONSIVE
} from "./types";
import { mergeTheme, isMobile } from "./utils/PlayerTheme";
import { useFullscreen } from "./utils/useFullscreen";
import { Display } from "./components/Display";
import { ProgressBar } from "./components/ProgressBar";
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
    elements = DEFAULT_PLAYER_ELEMENTS,
    responsive = DEFAULT_PLAYER_RESPONSIVE,
    overlays,
    className,
    style,
    show = true,
  },
  ref
) => {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Internal fullscreen ref for the entire player container
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Use internal fullscreen hook
  const { isFullscreen, toggleFullscreen } = useFullscreen(fullscreenRef);

  const mergedTheme = mergeTheme(theme);
  const mergedElements = { ...DEFAULT_PLAYER_ELEMENTS, ...elements };
  const mergedResponsive = { ...DEFAULT_PLAYER_RESPONSIVE, ...responsive };

  // Handle window resize for responsive behavior
  useEffect(() => {
    if (typeof window === 'undefined' || !mergedResponsive.enabled) return;
    
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mergedResponsive.enabled]);

  /**
   * Checks if an element should be shown based on user preferences and responsive logic
   */
  const shouldShowElement = useCallback(
    (element: keyof PlayerElements) => {
      // First check if element is enabled
      if (!mergedElements[element]) return false;

      // If responsive is disabled, show all enabled elements
      if (!mergedResponsive.enabled) return true;

      // Check if we're in mobile view
      const isMobileView = mergedResponsive.compact || 
        isMobile(screenWidth, mergedResponsive.breakpoint);

      // If mobile and this element should be hidden on mobile
      if (isMobileView && mergedResponsive.hideOnMobile?.[element]) {
        return false;
      }

      return true;
    },
    [mergedElements, mergedResponsive, screenWidth]
  );

  const handleDirectionClick = useCallback(() => {
    const newDirection = state.direction === 1 ? -1 : 1;
    actions.changeDirection(newDirection);
  }, [state.direction, actions]);

  const handleSpeedChange = useCallback((speed: number) => {
    actions.changeSpeed(speed);
  }, [actions]);

  const handleProgressChange = useCallback((frame: number, isDraggingEnded?: boolean) => {
    actions.seek(frame);
  }, [actions]);

  if (!show) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: mergedTheme.sizing.height,
    padding: `0 ${mergedTheme.spacing.padding}px`,
    backgroundColor: mergedTheme.colors.background,
    borderRadius: mergedResponsive.compact ? 0 : mergedTheme.sizing.borderRadius,
    backdropFilter: mergedTheme.effects.backdropBlur ? 'blur(8px)' : 'none',
    gap: mergedTheme.spacing.gap,
    flexWrap: 'nowrap',
    overflow: 'visible',
    transition: mergedTheme.effects.transitions ? 'all 200ms ease' : 'none',
    zIndex: 100,
    boxShadow: mergedTheme.effects.shadows ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
    ...style,
  };

  const progressContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
  };

  const controlGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Math.round((mergedTheme.spacing.gap || 8) * 0.5),
  };

  const dividerStyle: React.CSSProperties = {
    width: 1,
    height: 16,
    backgroundColor: mergedTheme.colors.border,
    opacity: 0.5,
  };

  // Show loading overlay
  if (state.isLoading && overlays?.loading) {
    return (
      <div style={containerStyle} className={className}>
        {overlays.loading}
      </div>
    );
  }

  // Show error overlay
  if (state.hasError && overlays?.error) {
    return (
      <div style={containerStyle} className={className}>
        {overlays.error}
      </div>
    );
  }

  return (
    <div
      ref={fullscreenRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        ...style,
      }}
      className={className}
    >
      {/* Display area for content */}
      <Display ref={ref} theme={theme} style={{ flex: 1 }} />
      
      {/* Controls container */}
      <div
        style={containerStyle}
        role="toolbar"
        aria-label="Animation controls"
      >
      {/* Primary playback controls */}
      <div style={controlGroupStyle}>
        {shouldShowElement('playPause') && !state.isPlaying && (
          <PlayButton 
            onClick={actions.play} 
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}

        {shouldShowElement('playPause') && state.isPlaying && (
          <PauseButton 
            onClick={actions.pause} 
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}

        {shouldShowElement('stop') && (
          <StopButton 
            onClick={actions.stop} 
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}
      </div>

      {/* Progress bar - always flexible */}
      {shouldShowElement('progressBar') && (
        <>
          <div style={dividerStyle} />
          <div style={progressContainerStyle}>
            <ProgressBar
              totalFrames={state.totalFrames}
              subscribeToFrame={subscriptions.frame}
              onChange={handleProgressChange}
              theme={theme}
              disabled={state.isLoading || state.hasError}
            />
          </div>
          <div style={dividerStyle} />
        </>
      )}

      {/* Secondary controls */}
      <div style={controlGroupStyle}>
        {shouldShowElement('frameIndicator') && (
          <FrameIndicator
            totalFrames={state.totalFrames || 0}
            subscribeToFrame={subscriptions.frame}
            decimals={0}
            showTotal={!mergedResponsive.compact}
            theme={theme}
          />
        )}

        {shouldShowElement('loop') && (
          <LoopButton 
            isOn={!!state.loop} 
            onClick={actions.toggleLoop}
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}

        {shouldShowElement('direction') && (
          <DirectionButton
            direction={state.direction}
            onClick={handleDirectionClick}
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}

        {shouldShowElement('speed') && (
          <SpeedButton
            speed={state.speed}
            speeds={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]}
            onSpeedChange={handleSpeedChange}
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}

        {shouldShowElement('fullscreen') && toggleFullscreen && (
          <FullscreenButton
            isFullscreen={isFullscreen}
            onClick={toggleFullscreen}
            theme={theme}
            disabled={state.isLoading || state.hasError}
          />
        )}
      </div>
      </div>
    </div>
  );
};

export const Player = forwardRef(PlayerWithRef);