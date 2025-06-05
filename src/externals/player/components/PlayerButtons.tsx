import { FC } from "react";

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
  ExitFullscreenIcon 
} from "./PlayerIcons";

// Play Button
export interface PlayButtonProps extends Pick<BaseButtonProps, "onClick" | "disabled" | "theme"> {}

export const PlayButton: FC<PlayButtonProps> = ({ onClick, disabled = false, theme }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="medium"
    ariaLabel="Play"
    tooltip="Play (k)"
    theme={theme}
  >
    <PlayIcon color="currentColor" />
  </BaseButton>
);

// Pause Button
export interface PauseButtonProps extends Pick<BaseButtonProps, "onClick" | "disabled" | "theme"> {}

export const PauseButton: FC<PauseButtonProps> = ({ onClick, disabled = false, theme }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="medium"
    ariaLabel="Pause"
    tooltip="Pause (k)"
    theme={theme}
  >
    <PauseIcon color="currentColor" />
  </BaseButton>
);

// Stop Button
export interface StopButtonProps extends Pick<BaseButtonProps, "onClick" | "disabled" | "theme"> {}

export const StopButton: FC<StopButtonProps> = ({ onClick, disabled = false, theme }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="medium"
    ariaLabel="Stop"
    tooltip="Stop"
    theme={theme}
  >
    <StopIcon color="currentColor" />
  </BaseButton>
);

// Loop Button
export interface LoopButtonProps extends Pick<BaseButtonProps, "onClick" | "disabled" | "theme"> {
  isOn: boolean;
}

export const LoopButton: FC<LoopButtonProps> = ({ onClick, disabled = false, isOn, theme }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    isActive={isOn}
    ariaLabel={isOn ? "Disable loop" : "Enable loop"}
    tooltip={isOn ? "Disable loop (l)" : "Enable loop (l)"}
    theme={theme}
  >
    <LoopIcon color="currentColor" />
  </BaseButton>
);

// Direction Button
export interface DirectionButtonProps extends Pick<BaseButtonProps, "onClick" | "disabled" | "theme"> {
  direction: 1 | -1;
}

export const DirectionButton: FC<DirectionButtonProps> = ({ onClick, disabled = false, direction, theme }) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    ariaLabel={direction === 1 ? "Reverse direction" : "Forward direction"}
    tooltip={direction === 1 ? "Reverse direction" : "Forward direction"}
    theme={theme}
  >
    {direction === 1 ? <DirectionRightIcon color="currentColor" /> : <DirectionLeftIcon color="currentColor" />}
  </BaseButton>
);

// Speed Button
export interface SpeedButtonProps extends Pick<BaseButtonProps, "disabled" | "theme"> {
  speed: number;
  speeds?: number[];
  onSpeedChange: (speed: number) => void;
}

export const SpeedButton: FC<SpeedButtonProps> = ({ 
  disabled = false, 
  speed, 
  speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2], 
  onSpeedChange,
  theme 
}) => {
  const DropdownContent = (setIsMenuOpen: (state: boolean) => void) => (
    <div style={{ padding: '4px 0' }}>
      {speeds.map((speedOption) => (
        <button
          key={speedOption}
          onClick={() => {
            onSpeedChange(speedOption);
            setIsMenuOpen(false);
          }}
          style={{
            width: '100%',
            padding: '8px 16px',
            border: 'none',
            background: speed === speedOption ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: 'white',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '14px',
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
      ariaLabel={`Playback speed: ${speed}x`}
      tooltip={`Speed: ${speed}x`}
      theme={theme}
      DropdownContent={DropdownContent}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <SpeedIcon color="currentColor" size={12} />
        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{speed}x</span>
      </div>
    </BaseButton>
  );
};

// Fullscreen Button
export interface FullscreenButtonProps extends Pick<BaseButtonProps, "onClick" | "disabled" | "theme"> {
  isFullscreen: boolean;
}

export const FullscreenButton: FC<FullscreenButtonProps> = ({ 
  onClick, 
  disabled = false, 
  isFullscreen, 
  theme 
}) => (
  <BaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    tooltip={isFullscreen ? "Exit fullscreen (f)" : "Enter fullscreen (f)"}
    theme={theme}
  >
    {isFullscreen ? <ExitFullscreenIcon color="currentColor" /> : <FullscreenIcon color="currentColor" />}
  </BaseButton>
);