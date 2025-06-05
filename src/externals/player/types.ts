import { RefObject, ReactNode } from 'react';

/**
 * Player state for initial render and non-subscribable data
 */
export interface PlayerState {
  isPlaying: boolean;
  totalFrames: number;
  direction: 1 | -1;
  loop: boolean | number;
  speed: number;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * Subscription functions for performance-critical updates
 */
export interface PlayerSubscriptions {
  frame: (callback: (currentFrame: number) => void) => () => void;
  state: (callback: (state: PlayerState) => void) => () => void;
}

/**
 * Player actions that consumer must provide
 */
export interface PlayerActions {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (frame: number, isDraggingEnded?: boolean) => void;
  changeSpeed: (speed: number) => void;
  changeDirection: (direction: 1 | -1) => void;
  toggleLoop: () => void;
}

/**
 * Visual customization options for the player
 */
export interface PlayerTheme {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    backgroundHover?: string;
    text?: string;
    border?: string;
    accent?: string;
  };
  sizing?: {
    height?: number;
    buttonSize?: number;
    fontSize?: number;
    borderRadius?: number;
  };
  spacing?: {
    padding?: number;
    gap?: number;
  };
  effects?: {
    backdropBlur?: boolean;
    shadows?: boolean;
    transitions?: boolean;
  };
}

/**
 * Configuration for which elements to show/hide
 */
export interface PlayerElements {
  playPause?: boolean;
  stop?: boolean;
  progressBar?: boolean;
  frameIndicator?: boolean;
  speed?: boolean;
  direction?: boolean;
  loop?: boolean;
  fullscreen?: boolean;
}

/**
 * Responsive behavior configuration
 */
export interface PlayerResponsive {
  enabled?: boolean;
  breakpoint?: number;
  compact?: boolean;
  hideOnMobile?: PlayerElements;
}

/**
 * Custom overlays that consumer can provide
 */
export interface PlayerOverlays {
  loading?: ReactNode;
  error?: ReactNode;
}

/**
 * Main configuration object passed to the player
 */
export interface PlayerConfig {
  state: PlayerState;
  subscriptions: PlayerSubscriptions;
  actions: PlayerActions;
  theme?: PlayerTheme;
  controls?: boolean | PlayerElements;
  responsive?: PlayerResponsive;
  overlays?: PlayerOverlays;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for the main Player component
 */
export interface PlayerProps extends PlayerConfig {
  show?: boolean;
}

/**
 * Default theme values
 */
export const DEFAULT_PLAYER_THEME: Required<PlayerTheme> = {
  colors: {
    primary: '#ffffff',
    secondary: '#ffffff80',
    background: '#00000080',
    backgroundHover: '#ffffff20',
    text: '#ffffff',
    border: '#ffffff30',
    accent: '#ff6b6b',
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
 * Default element visibility
 */
export const DEFAULT_PLAYER_ELEMENTS: Required<PlayerElements> = {
  playPause: true,
  stop: true,
  progressBar: true,
  frameIndicator: true,
  speed: true,
  direction: true,
  loop: true,
  fullscreen: true,
};

/**
 * Default responsive configuration
 */
export const DEFAULT_PLAYER_RESPONSIVE: Required<PlayerResponsive> = {
  enabled: true,
  breakpoint: 480,
  compact: false,
  hideOnMobile: {
    stop: true,
    speed: true,
    direction: true,
    frameIndicator: true,
  },
};