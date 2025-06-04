import { useEffect, useState } from "react";
import { UseLottieFactoryResult, LottieSubscription } from "../../@types";
import { PlayerControlsTheme } from "./styles/PlayerControlsTheme";

export type ModernFramesIndicatorProps = Pick<
  UseLottieFactoryResult,
  "totalFrames" | "subscribe"
> & {
  decimals?: number;
  showTotal?: boolean;
};

/**
 * Compact frames indicator component
 * Shows current/total frames in a YouTube-style format
 */
export const ModernFramesIndicator = ({
  subscribe,
  totalFrames = 0,
  decimals = 0,
  showTotal = true,
}: ModernFramesIndicatorProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    return subscribe(LottieSubscription.Frame, ({ currentFrame: frame }) => {
      setCurrentFrame(frame);
    });
  }, [subscribe]);

  const formatFrame = (frame: number): string => {
    return frame.toFixed(decimals);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: PlayerControlsTheme.sizes.controlsHeight,
    fontSize: PlayerControlsTheme.typography.fontSize,
    fontWeight: PlayerControlsTheme.typography.fontWeight,
    color: PlayerControlsTheme.colors.iconSecondary,
    fontFamily: 'monospace', // For consistent digit spacing
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle} aria-label="Current frame">
      {showTotal ? (
        <>
          <span style={{ color: PlayerControlsTheme.colors.iconPrimary }}>
            {formatFrame(currentFrame)}
          </span>
          <span style={{ margin: '0 2px' }}>/</span>
          <span>{formatFrame(totalFrames)}</span>
        </>
      ) : (
        <span style={{ color: PlayerControlsTheme.colors.iconPrimary }}>
          {formatFrame(currentFrame)}
        </span>
      )}
    </div>
  );
};