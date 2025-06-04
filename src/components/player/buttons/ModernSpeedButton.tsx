import { FC } from "react";
import { ModernBaseButton } from "../../misc/ModernBaseButton";
import { SpeedIcon, SpeedSlowIcon, SpeedFastIcon } from "../icons/PlayerIcons";
import { PlayerControlsTheme } from "../styles/PlayerControlsTheme";

export interface ModernSpeedButtonProps {
  speed: number;
  speeds?: number[];
  onClick: (speed: number) => void;
  disabled?: boolean;
}

export const ModernSpeedButton: FC<ModernSpeedButtonProps> = ({
  speed,
  speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2],
  onClick,
  disabled = false,
}) => {
  const getSpeedIcon = () => {
    if (speed < 1) return <SpeedSlowIcon color="currentColor" />;
    if (speed > 1) return <SpeedFastIcon color="currentColor" />;
    return <SpeedIcon color="currentColor" />;
  };

  const getSpeedLabel = (speedValue: number): string => {
    if (speedValue === 1) return "Normal";
    if (speedValue < 1) return `${speedValue}x (Slow)`;
    return `${speedValue}x (Fast)`;
  };

  return (
    <ModernBaseButton
      disabled={disabled}
      variant={speed !== 1 ? "accent" : "secondary"}
      size="small"
      isActive={speed !== 1}
      ariaLabel={`Playback speed: ${getSpeedLabel(speed)}`}
      tooltip="Playback speed"
      DropdownContent={(setShowDropdown) => (
        <div style={{ padding: PlayerControlsTheme.sizes.gapSmall }}>
          <div
            style={{
              color: PlayerControlsTheme.colors.iconPrimary,
              padding: `${PlayerControlsTheme.sizes.gapSmall}px ${PlayerControlsTheme.sizes.gapMedium}px`,
              fontSize: PlayerControlsTheme.typography.fontSize,
              fontWeight: PlayerControlsTheme.typography.fontWeight,
              borderBottom: `1px solid ${PlayerControlsTheme.colors.buttonIdle}`,
              marginBottom: PlayerControlsTheme.sizes.gapSmall,
            }}
          >
            Playback Speed
          </div>
          
          {speeds.map((newSpeed) => (
            <button
              key={newSpeed}
              style={{
                display: 'block',
                width: '100%',
                padding: `${PlayerControlsTheme.sizes.gapSmall}px ${PlayerControlsTheme.sizes.gapMedium}px`,
                backgroundColor: 'transparent',
                color: speed === newSpeed 
                  ? PlayerControlsTheme.colors.iconAccent 
                  : PlayerControlsTheme.colors.iconPrimary,
                border: 'none',
                borderRadius: PlayerControlsTheme.sizes.borderRadius,
                fontSize: PlayerControlsTheme.typography.fontSize,
                fontWeight: speed === newSpeed ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: `all ${PlayerControlsTheme.transitions.fast}`,
              }}
              onMouseEnter={(e) => {
                if (speed !== newSpeed) {
                  e.currentTarget.style.backgroundColor = PlayerControlsTheme.colors.buttonHover;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                onClick(newSpeed);
                setShowDropdown(false);
              }}
            >
              {getSpeedLabel(newSpeed)}
            </button>
          ))}
        </div>
      )}
    >
      {getSpeedIcon()}
    </ModernBaseButton>
  );
};