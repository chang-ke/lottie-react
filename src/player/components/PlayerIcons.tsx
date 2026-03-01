import { FC } from "react";

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Optimized SVG icons for small sizes (YouTube-inspired)

export const PlayIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M8 5v14l11-7z"
      fill={color}
    />
  </svg>
);

export const PauseIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
      fill={color}
    />
  </svg>
);

export const StopIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M6 6h12v12H6z"
      fill={color}
    />
  </svg>
);

export const LoopIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
      fill={color}
    />
  </svg>
);

export const DirectionRightIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
      fill={color}
    />
  </svg>
);

export const DirectionLeftIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"
      fill={color}
    />
  </svg>
);

export const SpeedIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 5-5v10z"
      fill={color}
    />
    <circle cx="15.5" cy="12" r="1.5" fill={color} />
  </svg>
);

export const FullscreenIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
      fill={color}
    />
  </svg>
);

export const ExitFullscreenIcon: FC<IconProps> = ({ size = 16, color = "currentColor", className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
      fill={color}
    />
  </svg>
);