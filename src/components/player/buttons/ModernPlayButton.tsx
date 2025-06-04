import { FC } from "react";
import { ModernBaseButton, ModernBaseButtonProps } from "../../misc/ModernBaseButton";
import { PlayIcon } from "../icons/PlayerIcons";

export const ModernPlayButton: FC<Pick<ModernBaseButtonProps, "onClick" | "disabled">> = ({
  onClick,
  disabled = false,
}) => (
  <ModernBaseButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="medium"
    ariaLabel="Play"
    tooltip="Play (k)"
  >
    <PlayIcon color="currentColor" />
  </ModernBaseButton>
);