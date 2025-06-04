import { FC } from "react";
import { ModernBaseButton, ModernBaseButtonProps } from "../../misc/ModernBaseButton";
import { StopIcon } from "../icons/PlayerIcons";

export const ModernStopButton: FC<Pick<ModernBaseButtonProps, "onClick" | "disabled">> = ({
  onClick,
  disabled = false,
}) => (
  <ModernBaseButton
    onClick={onClick}
    disabled={disabled}
    variant="secondary"
    size="small"
    ariaLabel="Stop"
    tooltip="Stop"
  >
    <StopIcon color="currentColor" />
  </ModernBaseButton>
);