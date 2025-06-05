import { PlayerTheme, DEFAULT_PLAYER_THEME } from '../types';

/**
 * Merges user theme with default theme
 */
export const mergeTheme = (userTheme?: PlayerTheme): Required<PlayerTheme> => {
  if (!userTheme) return DEFAULT_PLAYER_THEME;

  return {
    colors: {
      ...DEFAULT_PLAYER_THEME.colors,
      ...userTheme.colors,
    },
    sizing: {
      ...DEFAULT_PLAYER_THEME.sizing,
      ...userTheme.sizing,
    },
    spacing: {
      ...DEFAULT_PLAYER_THEME.spacing,
      ...userTheme.spacing,
    },
    effects: {
      ...DEFAULT_PLAYER_THEME.effects,
      ...userTheme.effects,
    },
  };
};

/**
 * Get responsive size based on screen width
 */
export const getResponsiveSize = (baseSize: number, screenWidth: number, breakpoint = 480): number => {
  if (screenWidth < breakpoint) {
    return Math.max(baseSize * 0.8, 20); // Minimum 20px for touch targets
  }
  if (screenWidth < breakpoint * 1.6) {
    return baseSize * 0.9;
  }
  return baseSize;
};

/**
 * Calculate if screen is mobile based on breakpoint
 */
export const isMobile = (screenWidth: number, breakpoint = 480): boolean => {
  return screenWidth < breakpoint;
};

/**
 * Get button colors based on state
 */
export const getButtonColors = (
  theme: Required<PlayerTheme>,
  options: {
    disabled?: boolean;
    isActive?: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
    isMenuOpen?: boolean;
    variant?: 'primary' | 'secondary' | 'accent';
  }
) => {
  const { disabled, isActive, isHovered, isFocused, isMenuOpen, variant = 'secondary' } = options;

  const backgroundColor = (() => {
    if (disabled) return `${theme.colors.background ?? '#000000'}20`; // 20% opacity
    if (isActive) return `${theme.colors.accent ?? '#ff6b6b'}40`; // 40% opacity
    if (isHovered || isFocused || isMenuOpen) return theme.colors.backgroundHover;
    return theme.colors.background;
  })();

  const iconColor = (() => {
    if (disabled) return `${theme.colors.text ?? '#ffffff'}30`; // 30% opacity
    if (variant === 'accent' || isActive) return theme.colors.accent;
    if (variant === 'primary') return theme.colors.primary;
    return theme.colors.secondary;
  })();

  return { backgroundColor, iconColor };
};

/**
 * Generate CSS custom properties from theme
 */
export const generateCSSVars = (theme: Required<PlayerTheme>): Record<string, string> => {
  return {
    '--player-primary': theme.colors.primary ?? '#ffffff',
    '--player-secondary': theme.colors.secondary ?? '#ffffff80',
    '--player-background': theme.colors.background ?? '#00000080',
    '--player-background-hover': theme.colors.backgroundHover ?? '#ffffff20',
    '--player-text': theme.colors.text ?? '#ffffff',
    '--player-border': theme.colors.border ?? '#ffffff30',
    '--player-accent': theme.colors.accent ?? '#ff6b6b',
    '--player-height': `${String(theme.sizing.height ?? 48)}px`,
    '--player-button-size': `${String(theme.sizing.buttonSize ?? 32)}px`,
    '--player-font-size': `${String(theme.sizing.fontSize ?? 12)}px`,
    '--player-border-radius': `${String(theme.sizing.borderRadius ?? 6)}px`,
    '--player-padding': `${String(theme.spacing.padding ?? 12)}px`,
    '--player-gap': `${String(theme.spacing.gap ?? 8)}px`,
  };
};