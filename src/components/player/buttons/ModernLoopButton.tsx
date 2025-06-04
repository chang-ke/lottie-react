import { FC } from "react";
import { ModernBaseButton, ModernBaseButtonProps } from "../../misc/ModernBaseButton";
import { LoopIcon } from "../icons/PlayerIcons";

export interface ModernLoopButtonProps extends Pick<ModernBaseButtonProps, "onClick" | "disabled"> {
  isOn: boolean;
}

export const ModernLoopButton: FC<ModernLoopButtonProps> = ({
  onClick,
  disabled = false,
  isOn,
}) => (
  <ModernBaseButton
    onClick={onClick}
    disabled={disabled}
    variant={isOn ? "accent" : "secondary"}
    size="small"
    isActive={isOn}
    ariaLabel={isOn ? "Turn off loop" : "Turn on loop"}
    tooltip={isOn ? "Loop is on" : "Loop is off"}
  >
    <LoopIcon color="currentColor" />
  </ModernBaseButton>
);