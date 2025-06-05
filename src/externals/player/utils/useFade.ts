import { CSSProperties, useEffect, useState, useCallback } from "react";

interface UseFadeProps {
  shouldShow: boolean;
  fadeOutTime?: number | null;
  minimumDisplayTime?: number | null;
}

enum TimeoutState {
  NotStarted = "NOT_STARTED",
  InProgress = "IN_PROGRESS", 
  Finished = "FINISHED",
}

/**
 * Self-contained fade hook for the external player library
 * Handles minimum display time and fade out transitions
 */
export const useFade = ({
  shouldShow,
  fadeOutTime = 600,
  minimumDisplayTime = 0,
}: UseFadeProps) => {
  const animationName = "player-overlay-fade-out";
  
  const [isVisible, setIsVisible] = useState(shouldShow);
  const [internalShow, setInternalShow] = useState(shouldShow);
  const [timeoutState, setTimeoutState] = useState<TimeoutState>(TimeoutState.NotStarted);

  // Handle shouldShow changes
  useEffect(() => {
    if (shouldShow === internalShow) return;

    if (shouldShow) {
      // Show immediately
      setIsVisible(true);
      setInternalShow(true);
      
      // Start minimum display timer if needed
      if (minimumDisplayTime && minimumDisplayTime > 0) {
        setTimeoutState(TimeoutState.InProgress);
        const timer = setTimeout(() => {
          setTimeoutState(TimeoutState.Finished);
        }, minimumDisplayTime);
        
        return () => { clearTimeout(timer); };
      } else {
        setTimeoutState(TimeoutState.Finished);
      }
    } else {
      setInternalShow(false);
    }
  }, [shouldShow, internalShow, minimumDisplayTime]);

  // Handle fade out when conditions are met
  useEffect(() => {
    if (
      !internalShow && 
      isVisible && 
      timeoutState === TimeoutState.Finished &&
      (!fadeOutTime || fadeOutTime <= 0)
    ) {
      // No fade animation, hide immediately
      setIsVisible(false);
    }
  }, [internalShow, isVisible, timeoutState, fadeOutTime]);

  const onAnimationEnd = useCallback((event: { animationName: string }) => {
    if (event.animationName === animationName && !internalShow) {
      setIsVisible(false);
    }
  }, [internalShow]);

  const shouldStartFadeOut = !internalShow && 
    timeoutState === TimeoutState.Finished && 
    fadeOutTime && 
    fadeOutTime > 0;

  const style: CSSProperties = shouldStartFadeOut ? {
    animationName,
    animationDuration: `${String(fadeOutTime)}ms`,
    animationFillMode: 'forwards',
  } : {};

  // Inject keyframes for fade out animation
  const keyframes = `
    @keyframes ${animationName} {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;

  const fadeProps = {
    style,
    onAnimationEnd,
    keyframes,
  };

  return { isVisible, fadeProps };
};