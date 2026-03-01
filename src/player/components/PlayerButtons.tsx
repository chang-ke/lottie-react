import { FC, JSX, useState } from "react";

import { mergeTheme } from "../utils/PlayerTheme";

import { BaseButton, BaseButtonProps } from "./BaseButton";
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  LoopIcon,
  DirectionRightIcon,
  DirectionLeftIcon,
  SpeedIcon,
  FullscreenIcon,
  ExitFullscreenIcon,
} from "./PlayerIcons";

type ButtonBase = Pick<BaseButtonProps, "onClick" | "disabled" | "theme" | "screenWidth">;

// Play Button
export type PlayButtonProps = ButtonBase;

export const PlayButton: FC<PlayButtonProps> = ({ onClick, disabled = false, theme, screenWidth }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="medium"
    ariaLabel="Play"
    tooltip="Play (k)"
    theme={theme}
    screenWidth={screenWidth}
  >
    <PlayIcon color="currentColor" />
  </BaseButton>
);

// Pause Button
export type PauseButtonProps = ButtonBase;

export const PauseButton: FC<PauseButtonProps> = ({ onClick, disabled = false, theme, screenWidth }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="medium"
    ariaLabel="Pause"
    tooltip="Pause (k)"
    theme={theme}
    screenWidth={screenWidth}
  >
    <PauseIcon color="currentColor" />
  </BaseButton>
);

// Stop Button
export type StopButtonProps = ButtonBase;

export const StopButton: FC<StopButtonProps> = ({ onClick, disabled = false, theme, screenWidth }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="medium"
    ariaLabel="Stop"
    tooltip="Stop"
    theme={theme}
    screenWidth={screenWidth}
  >
    <StopIcon color="currentColor" />
  </BaseButton>
);

// Loop Button
export interface LoopButtonProps extends ButtonBase {
  isOn: boolean;
}

export const LoopButton: FC<LoopButtonProps> = ({ onClick, disabled = false, isOn, theme, screenWidth }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    isActive={isOn}
    ariaLabel={isOn ? "Disable loop" : "Enable loop"}
    tooltip={isOn ? "Disable loop (l)" : "Enable loop (l)"}
    theme={theme}
    screenWidth={screenWidth}
  >
    <LoopIcon color="currentColor" />
  </BaseButton>
);

// Direction Button
export interface DirectionButtonProps extends ButtonBase {
  direction: 1 | -1;
}

export const DirectionButton: FC<DirectionButtonProps> = ({ onClick, disabled = false, direction, theme, screenWidth }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    ariaLabel={direction === 1 ? "Reverse direction" : "Forward direction"}
    tooltip={direction === 1 ? "Reverse direction" : "Forward direction"}
    theme={theme}
    screenWidth={screenWidth}
  >
    {direction === 1 ? <DirectionRightIcon color="currentColor" /> : <DirectionLeftIcon color="currentColor" />}
  </BaseButton>
);

// Speed Button
export interface SpeedButtonProps extends Pick<BaseButtonProps, "disabled" | "theme" | "screenWidth"> {
  speed: number;
  speeds?: number[];
  onSpeedChange: (speed: number) => void;
}

export const SpeedButton: FC<SpeedButtonProps> = ({
  disabled = false,
  speed,
  speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
  onSpeedChange,
  theme,
  screenWidth,
}) => {
  const mergedTheme = mergeTheme(theme);
  const [hoveredSpeed, setHoveredSpeed] = useState<number | null>(null);

  const DropdownContent = (setIsMenuOpen: (state: boolean) => void): JSX.Element => (
    <div style={{ padding: "4px 0" }}>
      {speeds.map((speedOption) => (
        <button
          key={speedOption}
          onClick={() => {
            onSpeedChange(speedOption);
            setIsMenuOpen(false);
          }}
          onMouseEnter={() => { setHoveredSpeed(speedOption); }}
          onMouseLeave={() => { setHoveredSpeed(null); }}
          style={{
            width: "100%",
            padding: "8px 16px",
            border: "none",
            background:
              speed === speedOption || hoveredSpeed === speedOption
                ? mergedTheme.colors.backgroundHover
                : "transparent",
            color: mergedTheme.colors.text,
            textAlign: "left",
            cursor: "pointer",
            fontSize: `${String(mergedTheme.sizing.fontSize)}px`,
            fontWeight: speed === speedOption ? 600 : 400,
          }}
        >
          {speedOption}x
        </button>
      ))}
    </div>
  );

  return (
    <BaseButton
      disabled={disabled}
      variant="secondary"
      size="small"
      ariaLabel={`Playback speed: ${String(speed)}x`}
      tooltip={`Speed: ${String(speed)}x`}
      theme={theme}
      screenWidth={screenWidth}
      DropdownContent={DropdownContent}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <SpeedIcon color="currentColor" size={12} />
        <span style={{ fontSize: "10px", fontWeight: "bold" }}>{speed}x</span>
      </div>
    </BaseButton>
  );
};

// Fullscreen Button
export interface FullscreenButtonProps extends ButtonBase {
  isFullscreen: boolean;
}

export const FullscreenButton: FC<FullscreenButtonProps> = ({
  onClick,
  disabled = false,
  isFullscreen,
  theme,
  screenWidth,
}) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    tooltip={isFullscreen ? "Exit fullscreen (f)" : "Enter fullscreen (f)"}
    theme={theme}
    screenWidth={screenWidth}
  >
    {isFullscreen ? <ExitFullscreenIcon color="currentColor" /> : <FullscreenIcon color="currentColor" />}
  </BaseButton>
);
