import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
} from "react";

import { PlayerTheme } from "../types";
import { mergeTheme } from "../utils/PlayerTheme";

export interface ProgressBarProps {
  totalFrames: number;
  disabled?: boolean;
  theme?: PlayerTheme;
  subscribeToFrame: (callback: (currentFrame: number) => void) => () => void;
  onChange?: (progress: number, isDraggingEnded?: boolean) => void;
}

/**
 * Isolated Progress Bar component for the external player
 * Uses native input[type="range"] for optimal performance
 * Subscribes to frame updates to avoid parent re-renders
 */
export const ProgressBar = (props: ProgressBarProps) => {
  const containerRef = useRef<HTMLInputElement>(null);
  const { totalFrames, disabled, theme, subscribeToFrame, onChange } = props;
  const mergedTheme = mergeTheme(theme);

  /**
   * Subscribe to frame updates for performance
   */
  useEffect(() => {
    return subscribeToFrame((currentFrame) => {
      if (containerRef.current) {
        // Update the `value` of the input range
        containerRef.current.value = String(currentFrame);
        // Set the `--value` CSS value so the styling can adapt
        containerRef.current.style.setProperty("--value", String(currentFrame));
      }
    });
  }, [subscribeToFrame]);

  /**
   * Handle any changes of the progress bar
   */
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const newFrame = Number(event.target.value);
    // During dragging, seek without ending flag
    onChange?.(newFrame, false);
  };

  /**
   * Handle mouse up on the progress bar to indicate dragging has ended
   */
  const onMouseUpHandler: MouseEventHandler<HTMLInputElement> = () => {
    if (containerRef.current) {
      // When dragging ends, call with isDraggingEnded flag
      onChange?.(Number(containerRef.current.value), true);
    }
  };

  const progressBarStyle: React.CSSProperties = {
    width: "100%",
    height: "6px",
    margin: 0,
    padding: 0,
    border: "none",
    borderRadius: mergedTheme.sizing.borderRadius,
    backgroundColor: "transparent",
    outline: "none",
    cursor: disabled ? "default" : "pointer",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
    // Track styling
    background: `linear-gradient(to right,
      ${mergedTheme.colors.accent} 0%,
      ${mergedTheme.colors.accent} calc(var(--value, 0) / var(--max, ${String(totalFrames)}) * 100%),
      ${mergedTheme.colors.border} calc(var(--value, 0) / var(--max, ${String(totalFrames)}) * 100%),
      ${mergedTheme.colors.border} 100%)`,
    transition: mergedTheme.effects.transitions ? "all 150ms ease" : "none",
  };

  // Webkit (Chrome, Safari) thumb styling
  const webkitThumbStyle = `
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${mergedTheme.colors.primary};
      border: 2px solid ${mergedTheme.colors.background};
      cursor: pointer;
      box-shadow: ${mergedTheme.effects.shadows ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "none"};
      transition: ${mergedTheme.effects.transitions ? "all 150ms ease" : "none"};
    }
    
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      background: ${mergedTheme.colors.accent};
    }
    
    input[type="range"]:disabled::-webkit-slider-thumb {
      cursor: default;
      opacity: 0.5;
      transform: none;
    }
  `;

  // Firefox thumb styling
  const mozThumbStyle = `
    input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${mergedTheme.colors.primary};
      border: 2px solid ${mergedTheme.colors.background};
      cursor: pointer;
      box-shadow: ${mergedTheme.effects.shadows ? "0 2px 4px rgba(0, 0, 0, 0.2)" : "none"};
      transition: ${mergedTheme.effects.transitions ? "all 150ms ease" : "none"};
    }
    
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
      background: ${mergedTheme.colors.accent};
    }
    
    input[type="range"]:disabled::-moz-range-thumb {
      cursor: default;
      opacity: 0.5;
      transform: none;
    }
  `;

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {/* Inject CSS for browser-specific styling */}
      <style>
        {webkitThumbStyle}
        {mozThumbStyle}
      </style>

      <input
        ref={containerRef}
        disabled={disabled ?? !totalFrames}
        type="range"
        style={
          {
            ...progressBarStyle,
            // CSS custom properties for styling
            "--min": 0,
            "--max": totalFrames,
            "--value": 0, // The initial value will be updated via subscription
          } as React.CSSProperties
        }
        onChange={onChangeHandler}
        onMouseUp={onMouseUpHandler}
        min={0}
        max={totalFrames}
        step={0.001}
        defaultValue={0}
        aria-label="Animation progress"
        aria-valuemin={0}
        aria-valuemax={totalFrames}
        aria-valuenow={0}
      />
    </div>
  );
};
