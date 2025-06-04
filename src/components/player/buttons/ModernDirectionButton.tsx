import { FC } from "react";
import { ModernBaseButton, ModernBaseButtonProps } from "../../misc/ModernBaseButton";
import { DirectionRightIcon, DirectionLeftIcon } from "../icons/PlayerIcons";
import { Direction } from "../../../@types";

export interface ModernDirectionButtonProps extends Pick<ModernBaseButtonProps, "onClick" | "disabled"> {
  direction: Direction;
}

export const ModernDirectionButton: FC<ModernDirectionButtonProps> = ({
  onClick,
  disabled = false,
  direction,
}) => {
  const isReversed = direction === Direction.Left;
  
  return (
    <ModernBaseButton
      onClick={onClick}
      disabled={disabled}
      variant={isReversed ? "accent" : "secondary"}
      size="small"
      isActive={isReversed}
      ariaLabel={isReversed ? "Playing in reverse" : "Playing forward"}
      tooltip={isReversed ? "Switch to forward" : "Switch to reverse"}
    >
      {isReversed ? (
        <DirectionLeftIcon color="currentColor" />
      ) : (
        <DirectionRightIcon color="currentColor" />
      )}
    </ModernBaseButton>
  );
};