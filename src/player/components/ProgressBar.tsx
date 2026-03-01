import React, {
  ChangeEventHandler,
  MouseEventHandler,
  TouchEventHandler,
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
  onChange?: (frame: number, isDraggingEnded?: boolean) => void;
}

/**
 * Seekable progress bar for the Player.
 *
 * Performance: subscribes directly to frame events and mutates the DOM input
 * element via a ref — no React re-renders during playback.
 *
 * Touch: `onTouchEnd` mirrors `onMouseUp` so seeking works on mobile.
 */
export const ProgressBar = (props: ProgressBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { totalFrames, disabled, theme, subscribeToFrame, onChange } = props;
  const mergedTheme = mergeTheme(theme);

  // Subscribe to frame updates — directly mutate the input value and CSS var
  useEffect(() => {
    return subscribeToFrame((currentFrame) => {
      if (inputRef.current) {
        inputRef.current.value = String(currentFrame);
        inputRef.current.style.setProperty("--value", String(currentFrame));
      }
    });
  }, [subscribeToFrame]);

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(Number(e.target.value), false);
  };

  const commitSeek = () => {
    if (inputRef.current) {
      onChange?.(Number(inputRef.current.value), true);
    }
  };

  const onMouseUpHandler: MouseEventHandler<HTMLInputElement> = commitSeek;
  const onTouchEndHandler: TouchEventHandler<HTMLInputElement> = commitSeek;

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
    background: `linear-gradient(to right,
      ${mergedTheme.colors.accent} 0%,
      ${mergedTheme.colors.accent} calc(var(--value, 0) / var(--max, ${String(totalFrames)}) * 100%),
      ${mergedTheme.colors.border} calc(var(--value, 0) / var(--max, ${String(totalFrames)}) * 100%),
      ${mergedTheme.colors.border} 100%)`,
    transition: mergedTheme.effects.transitions ? "background 150ms ease" : "none",
  };

  const thumbCss = `
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${mergedTheme.colors.primary};
      border: 2px solid ${mergedTheme.colors.background};
      cursor: pointer;
      box-shadow: ${mergedTheme.effects.shadows ? "0 2px 4px rgba(0,0,0,0.2)" : "none"};
      transition: ${mergedTheme.effects.transitions ? "transform 150ms ease" : "none"};
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
    input[type="range"]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${mergedTheme.colors.primary};
      border: 2px solid ${mergedTheme.colors.background};
      cursor: pointer;
      box-shadow: ${mergedTheme.effects.shadows ? "0 2px 4px rgba(0,0,0,0.2)" : "none"};
      transition: ${mergedTheme.effects.transitions ? "transform 150ms ease" : "none"};
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
      <style>{thumbCss}</style>
      <input
        ref={inputRef}
        disabled={disabled ?? !totalFrames}
        type="range"
        style={
          {
            ...progressBarStyle,
            "--min": 0,
            "--max": totalFrames,
            "--value": 0,
          } as React.CSSProperties
        }
        onChange={onChangeHandler}
        onMouseUp={onMouseUpHandler}
        onTouchEnd={onTouchEndHandler}
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
