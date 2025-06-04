// Modern button components (individual use)
export { ModernPlayButton } from '../buttons/ModernPlayButton';
export { ModernPauseButton } from '../buttons/ModernPauseButton';
export { ModernStopButton } from '../buttons/ModernStopButton';
export { ModernLoopButton } from '../buttons/ModernLoopButton';
export { ModernDirectionButton } from '../buttons/ModernDirectionButton';
export { ModernSpeedButton } from '../buttons/ModernSpeedButton';
export { ModernFullscreenButton } from '../buttons/ModernFullscreenButton';

// Modern utility components (individual use)
export { ModernProgressBar } from '../ModernProgressBar/ModernProgressBar';
export { ModernFramesIndicator } from '../ModernFramesIndicator';

// Modern base components (for custom implementations)
export { ModernBaseButton } from '../../misc/ModernBaseButton';
export type { ModernBaseButtonProps } from '../../misc/ModernBaseButton';

// Theme and styling (for customization)
export { PlayerControlsTheme, getResponsiveSize, defaultControlGroups } from '../styles/PlayerControlsTheme';
export type { ButtonVariant, ButtonSize, ControlGroup } from '../styles/PlayerControlsTheme';

// Icons (for custom implementations)
export * from '../icons/PlayerIcons';

// Note: The main PlayerControls component has been upgraded to use modern design.
// Use the regular PlayerControls export from the main player module.