import { FC } from "react";
import { ModernBaseButton, ModernBaseButtonProps } from "../../misc/ModernBaseButton";
import { FullscreenIcon, ExitFullscreenIcon } from "../icons/PlayerIcons";

export interface ModernFullscreenButtonProps extends Pick<ModernBaseButtonProps, "onClick" | "disabled"> {
  isFullscreen: boolean;
}

export const ModernFullscreenButton: FC<ModernFullscreenButtonProps> = ({
  onClick,
  disabled = false,
  isFullscreen,
}) => (
  <ModernBaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    isActive={isFullscreen}
    ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    tooltip={isFullscreen ? "Exit fullscreen (f)" : "Fullscreen (f)"}
  >
    {isFullscreen ? (
      <ExitFullscreenIcon color="currentColor" />
    ) : (
      <FullscreenIcon color="currentColor" />
    )}
  </ModernBaseButton>
);