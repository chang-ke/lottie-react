import React, { FC, useState, useEffect } from "react";

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
 * Isolated Frame Indicator component for the external player
 * Shows current frame and optionally total frames
 * Subscribes to frame updates to avoid parent re-renders
 */
export const FrameIndicator: FC<FrameIndicatorProps> = ({
  totalFrames,
  decimals = 0,
  showTotal = true,
  theme,
  subscribeToFrame,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const mergedTheme = mergeTheme(theme);

  useEffect(() => {
    return subscribeToFrame(setCurrentFrame);
  }, [subscribeToFrame]);

  const formatFrame = (frame: number): string => {
    return frame.toFixed(decimals);
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `${String(Math.round((mergedTheme.spacing.padding * 0.5)))}px ${String(mergedTheme.spacing.padding)}px`,
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
      title={`Frame ${formatFrame(currentFrame)}${showTotal ? ` of ${formatFrame(totalFrames)}` : ""}`}
      aria-label={`Current frame: ${formatFrame(currentFrame)}${showTotal ? ` of ${formatFrame(totalFrames)}` : ""}`}
    >
      <span style={currentFrameStyle}>{formatFrame(currentFrame)}</span>
      {showTotal && (
        <>
          <span style={separatorStyle}>/</span>
          <span style={totalFrameStyle}>{formatFrame(totalFrames)}</span>
        </>
      )}
    </div>
  );
};
