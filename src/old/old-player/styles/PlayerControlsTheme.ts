// YouTube-inspired theme system for player controls
export const PlayerControlsTheme = {
  // Sizing system (inspired by YouTube's compact controls)
  sizes: {
    // Button sizes
    buttonSmall: 24, // For secondary controls (loop, direction, etc.)
    buttonMedium: 32, // For primary controls (play, pause, stop)
    buttonLarge: 40, // For special controls (fullscreen, speed dropdown)

    // Icon sizes
    iconSmall: 16,
    iconMedium: 20,
    iconLarge: 24,

    // Spacing
    gapSmall: 4, // Between tightly grouped controls
    gapMedium: 8, // Standard gap between controls
    gapLarge: 12, // Between control groups

    // Layout
    controlsHeight: 40,
    controlsPadding: 8,
    borderRadius: 4,
  },

  // Colors (YouTube-inspired)
  colors: {
    // Interactive states
    buttonIdle: "rgba(255, 255, 255, 0.1)",
    buttonHover: "rgba(255, 255, 255, 0.2)",
    buttonActive: "rgba(255, 255, 255, 0.3)",
    buttonDisabled: "rgba(255, 255, 255, 0.05)",

    // Icons
    iconPrimary: "#ffffff",
    iconSecondary: "rgba(255, 255, 255, 0.8)",
    iconAccent: "#00d1c1",
    iconDisabled: "rgba(255, 255, 255, 0.3)",

    // Background
    controlsBackground: "rgba(0, 0, 0, 0.7)",
    dropdownBackground: "rgba(28, 28, 28, 0.95)",

    // Progress bar
    progressTrack: "rgba(255, 255, 255, 0.2)",
    progressFilled: "#00d1c1",
    progressHover: "#00f5e4",
    progressThumb: "#ffffff",
  },

  // Typography
  typography: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.2,
  },

  // Breakpoints for responsive design
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
  },

  // Animation
  transitions: {
    fast: "150ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
  },
} as const;

// Utility functions for responsive sizing
export const getResponsiveSize = (
  baseSize: number,
  screenWidth: number,
): number => {
  if (screenWidth < PlayerControlsTheme.breakpoints.mobile) {
    return Math.max(baseSize * 0.8, 20); // Minimum 20px for touch targets
  }
  if (screenWidth < PlayerControlsTheme.breakpoints.tablet) {
    return baseSize * 0.9;
  }
  return baseSize;
};

// Button variant types
export type ButtonVariant = "primary" | "secondary" | "accent";
export type ButtonSize = "small" | "medium" | "large";

// Control group configuration
export interface ControlGroup {
  id: string;
  priority: number; // Higher priority = more likely to be shown on small screens
  controls: string[];
}

export const defaultControlGroups: ControlGroup[] = [
  {
    id: "playback",
    priority: 100,
    controls: ["play", "pause", "stop"],
  },
  {
    id: "progress",
    priority: 90,
    controls: ["progressBar"],
  },
  {
    id: "settings",
    priority: 80,
    controls: ["speed", "loop", "direction"],
  },
  {
    id: "display",
    priority: 70,
    controls: ["framesIndicator"],
  },
  {
    id: "view",
    priority: 60,
    controls: ["fullscreen"],
  },
];
