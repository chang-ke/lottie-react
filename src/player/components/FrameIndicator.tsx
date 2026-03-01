import React, { FC, useEffect, useRef } from "react";

import { PlayerTheme } from "../types";
import { mergeTheme } from "../utils/PlayerTheme";

export interface FrameIndicatorProps {
  totalFrames: number;
  decimals?: number;
  showTotal?: boolean;
  theme?: PlayerTheme;
  subscribeToFrame: (callback: (currentFrame: number) => void) => () => void;
}

/**
 * Displays the current frame number alongside the total.
 *
 * Performance: subscribes directly to frame updates and mutates the DOM span
 * via a ref — this avoids setState calls at 60 fps and keeps this component
 * from ever causing a React re-render during playback.
 */
export const FrameIndicator: FC<FrameIndicatorProps> = ({
  totalFrames,
  decimals = 0,
  showTotal = true,
  theme,
  subscribeToFrame,
}) => {
  const currentFrameRef = useRef<HTMLSpanElement>(null);
  const mergedTheme = mergeTheme(theme);

  useEffect(() => {
    return subscribeToFrame((frame) => {
      if (currentFrameRef.current) {
        currentFrameRef.current.textContent = frame.toFixed(decimals);
      }
    });
  }, [subscribeToFrame, decimals]);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `${String(Math.round(mergedTheme.spacing.padding * 0.5))}px ${String(mergedTheme.spacing.padding)}px`,
    backgroundColor: mergedTheme.colors.background,
    borderRadius: mergedTheme.sizing.borderRadius,
    fontFamily:
      'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    fontSize: mergedTheme.sizing.fontSize,
    fontWeight: 500,
    color: mergedTheme.colors.text,
    whiteSpace: "nowrap",
    minWidth: showTotal ? "60px" : "40px",
    textAlign: "center",
    border: `1px solid ${mergedTheme.colors.border}`,
    transition: mergedTheme.effects.transitions ? "all 150ms ease" : "none",
  };

  const currentFrameStyle: React.CSSProperties = {
    color: mergedTheme.colors.primary,
    fontWeight: 600,
  };

  const separatorStyle: React.CSSProperties = {
    color: mergedTheme.colors.secondary,
    margin: "0 2px",
  };

  const totalFrameStyle: React.CSSProperties = {
    color: mergedTheme.colors.secondary,
  };

  return (
    <div
      style={containerStyle}
      aria-label={`Animation frame indicator`}
      aria-live="off"
    >
      <span ref={currentFrameRef} style={currentFrameStyle}>
        {(0).toFixed(decimals)}
      </span>
      {showTotal && (
        <>
          <span style={separatorStyle}>/</span>
          <span style={totalFrameStyle}>{totalFrames.toFixed(decimals)}</span>
        </>
      )}
    </div>
  );
};
