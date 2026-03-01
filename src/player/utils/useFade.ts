import { CSSProperties, useEffect, useState, useCallback, useRef } from "react";

interface UseFadeProps {
  shouldShow: boolean;
  fadeOutTime?: number | null;
  minimumDisplayTime?: number | null;
}

/**
 * Simple, working fade hook
 */
export const useFade = ({
  shouldShow,
  fadeOutTime = 600,
  minimumDisplayTime = 0,
}: UseFadeProps) => {
  const animationName = "player-overlay-fade-out";

  const [isVisible, setIsVisible] = useState(shouldShow);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [canHide, setCanHide] = useState(!minimumDisplayTime);
  const minDisplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // When shouldShow becomes true, show immediately and start the minimum timer
  // Only runs when shouldShow transitions to true
  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true);
      setIsFadingOut(false);
      setCanHide(!minimumDisplayTime);

      // Clear any existing timer
      if (minDisplayTimerRef.current) {
        clearTimeout(minDisplayTimerRef.current);
        minDisplayTimerRef.current = null;
      }

      // Start minimum display timer if specified
      if (minimumDisplayTime && minimumDisplayTime > 0) {
        minDisplayTimerRef.current = setTimeout(() => {
          setCanHide(true);
          minDisplayTimerRef.current = null;
        }, minimumDisplayTime);
      }
    }
    // Note: We only run this when shouldShow becomes true, not when it becomes false
    // This prevents the cleanup from clearing the timer when loading completes
  }, [shouldShow, minimumDisplayTime]);

  // Cleanup timer only on unmounting
  useEffect(() => {
    return () => {
      if (minDisplayTimerRef.current) {
        clearTimeout(minDisplayTimerRef.current);
        minDisplayTimerRef.current = null;
      }
    };
  }, []);

  // When shouldShow becomes false, and we can hide, start to fade out or hide immediately
  useEffect(() => {
    if (!shouldShow && canHide && isVisible && !isFadingOut) {
      if (fadeOutTime && fadeOutTime > 0) {
        setIsFadingOut(true);
      } else {
        setIsVisible(false);
      }
    }
  }, [shouldShow, canHide, isVisible, fadeOutTime, isFadingOut]);

  const onAnimationEnd = useCallback((event: { animationName: string }) => {
    if (event.animationName === animationName) {
      setIsVisible(false);
      setIsFadingOut(false);
    }
  }, []);

  const style: CSSProperties = isFadingOut
    ? {
        animationName,
        animationDuration: `${String(fadeOutTime)}ms`,
        animationFillMode: "forwards",
      }
    : {};

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
