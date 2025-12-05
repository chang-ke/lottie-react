import { ReactNode } from "react";

import {
  PlayerTheme,
  LoadingOverlayOptions,
  LoadingOverlayConfig,
} from "../types";

/**
 * Fully resolved theme type with all properties defined
 */
export interface ResolvedPlayerTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundHover: string;
    text: string;
    border: string;
    accent: string;
  };
  sizing: {
    height: number;
    buttonSize: number;
    fontSize: number;
    borderRadius: number;
  };
  spacing: {
    padding: number;
    gap: number;
  };
  effects: {
    backdropBlur: boolean;
    shadows: boolean;
    transitions: boolean;
  };
}

/**
 * Default theme values
 */
export const DEFAULT_PLAYER_THEME: ResolvedPlayerTheme = {
  colors: {
    primary: "#ffffff",
    secondary: "#ffffff80",
    background: "#00000080",
    backgroundHover: "#ffffff20",
    text: "#ffffff",
    border: "#ffffff30",
    accent: "#ff6b6b",
  },
  sizing: {
    height: 48,
    buttonSize: 32,
    fontSize: 12,
    borderRadius: 6,
  },
  spacing: {
    padding: 12,
    gap: 8,
  },
  effects: {
    backdropBlur: true,
    shadows: true,
    transitions: true,
  },
};

/**
 * Merges user theme with default theme
 */
export const mergeTheme = (userTheme?: PlayerTheme): ResolvedPlayerTheme => {
  if (!userTheme) return DEFAULT_PLAYER_THEME;

  return {
    colors: {
      primary: userTheme.colors?.primary ?? DEFAULT_PLAYER_THEME.colors.primary,
      secondary:
        userTheme.colors?.secondary ?? DEFAULT_PLAYER_THEME.colors.secondary,
      background:
        userTheme.colors?.background ?? DEFAULT_PLAYER_THEME.colors.background,
      backgroundHover:
        userTheme.colors?.backgroundHover ??
        DEFAULT_PLAYER_THEME.colors.backgroundHover,
      text: userTheme.colors?.text ?? DEFAULT_PLAYER_THEME.colors.text,
      border: userTheme.colors?.border ?? DEFAULT_PLAYER_THEME.colors.border,
      accent: userTheme.colors?.accent ?? DEFAULT_PLAYER_THEME.colors.accent,
    },
    sizing: {
      height: userTheme.sizing?.height ?? DEFAULT_PLAYER_THEME.sizing.height,
      buttonSize:
        userTheme.sizing?.buttonSize ?? DEFAULT_PLAYER_THEME.sizing.buttonSize,
      fontSize:
        userTheme.sizing?.fontSize ?? DEFAULT_PLAYER_THEME.sizing.fontSize,
      borderRadius:
        userTheme.sizing?.borderRadius ??
        DEFAULT_PLAYER_THEME.sizing.borderRadius,
    },
    spacing: {
      padding:
        userTheme.spacing?.padding ?? DEFAULT_PLAYER_THEME.spacing.padding,
      gap: userTheme.spacing?.gap ?? DEFAULT_PLAYER_THEME.spacing.gap,
    },
    effects: {
      backdropBlur:
        userTheme.effects?.backdropBlur ??
        DEFAULT_PLAYER_THEME.effects.backdropBlur,
      shadows:
        userTheme.effects?.shadows ?? DEFAULT_PLAYER_THEME.effects.shadows,
      transitions:
        userTheme.effects?.transitions ??
        DEFAULT_PLAYER_THEME.effects.transitions,
    },
  };
};

/**
 * Get responsive size based on screen width
 */
export const getResponsiveSize = (
  baseSize: number,
  screenWidth: number,
  breakpoint = 480,
): number => {
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
  theme: ResolvedPlayerTheme,
  options: {
    disabled?: boolean;
    isActive?: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
    isMenuOpen?: boolean;
    variant?: "primary" | "secondary" | "accent";
  },
) => {
  const {
    disabled,
    isActive,
    isHovered,
    isFocused,
    isMenuOpen,
    variant = "secondary",
  } = options;

  const backgroundColor = (() => {
    if (disabled) return `${theme.colors.background}20`; // 20% opacity
    if (isActive) return `${theme.colors.accent}40`; // 40% opacity
    if (isHovered || isFocused || isMenuOpen)
      return theme.colors.backgroundHover;
    return theme.colors.background;
  })();

  const iconColor = (() => {
    if (disabled) return `${theme.colors.text}30`; // 30% opacity
    if (variant === "accent" || isActive) return theme.colors.accent;
    if (variant === "primary") return theme.colors.primary;
    return theme.colors.secondary;
  })();

  return { backgroundColor, iconColor };
};

/**
 * Process loading overlay options into a standardized config
 */
export const processLoadingConfig = (
  loading?: LoadingOverlayOptions,
): LoadingOverlayConfig | null => {
  // Explicitly disabled
  if (loading === null) {
    return null;
  }

  // No loading config provided - use default
  if (loading === undefined) {
    return {
      minDisplayTime: 0,
      fadeOutTime: 600,
    };
  }

  // Check if it's a config object (has config-specific properties)
  if (
    typeof loading === "object" &&
    ("component" in loading ||
      "minDisplayTime" in loading ||
      "fadeOutTime" in loading)
  ) {
    // It's a LoadingOverlayConfig
    return {
      minDisplayTime: 0,
      fadeOutTime: 600,
      ...loading,
    };
  }

  // It's a ReactNode
  return {
    component: loading as ReactNode,
    minDisplayTime: 0,
    fadeOutTime: 600,
  };
};

/**
 * Generate CSS custom properties from theme
 */
export const generateCSSVars = (
  theme: ResolvedPlayerTheme,
): Record<string, string> => {
  return {
    "--player-primary": theme.colors.primary,
    "--player-secondary": theme.colors.secondary,
    "--player-background": theme.colors.background,
    "--player-background-hover": theme.colors.backgroundHover,
    "--player-text": theme.colors.text,
    "--player-border": theme.colors.border,
    "--player-accent": theme.colors.accent,
    "--player-height": `${String(theme.sizing.height)}px`,
    "--player-button-size": `${String(theme.sizing.buttonSize)}px`,
    "--player-font-size": `${String(theme.sizing.fontSize)}px`,
    "--player-border-radius": `${String(theme.sizing.borderRadius)}px`,
    "--player-padding": `${String(theme.spacing.padding)}px`,
    "--player-gap": `${String(theme.spacing.gap)}px`,
  };
};
