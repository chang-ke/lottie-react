import { FC } from "react";
import { ModernBaseButton, ModernBaseButtonProps } from "../../misc/ModernBaseButton";
import { PauseIcon } from "../icons/PlayerIcons";

export const ModernPauseButton: FC<Pick<ModernBaseButtonProps, "onClick" | "disabled">> = ({
  onClick,
  disabled = false,
}) => (
  <ModernBaseButton
    onClick={onClick}
    disabled={disabled}
    variant="primary"
    size="medium"
    ariaLabel="Pause"
    tooltip="Pause (k)"
  >
    <PauseIcon color="currentColor" />
  </ModernBaseButton>
);