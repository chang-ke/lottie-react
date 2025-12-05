import { FC } from "react";

import { LoadingOverlayConfig } from "../types";
import { useFade } from "../utils/useFade";

export interface LoadingOverlayProps {
  show: boolean;
  config?: LoadingOverlayConfig;
}

/**
 * Default loading spinner component
 */
const DefaultLoadingSpinner: FC<{ color?: string; size?: number }> = ({
  color = "#ffffff",
  size = 40,
}) => {
  const keyframes = `
    @keyframes loading-spinner-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        style={{
          width: size,
          height: size,
          border: `${String(size * 0.1)}px solid ${color}30`,
          borderTop: `${String(size * 0.1)}px solid ${color}`,
          borderRadius: "50%",
          animation: "loading-spinner-rotate 1s linear infinite",
        }}
      />
    </>
  );
};

/**
 * Loading overlay component with fade functionality
 * Supports minimum display time and customizable fade out duration
 */
export const LoadingOverlay: FC<LoadingOverlayProps> = ({ show, config }) => {
  const { component, minDisplayTime = 0, fadeOutTime = 600 } = config ?? {};

  const { isVisible, fadeProps } = useFade({
    shouldShow: show,
    fadeOutTime,
    minimumDisplayTime: minDisplayTime,
  });

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <style>{fadeProps.keyframes}</style>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1000,
          ...fadeProps.style,
        }}
        // TODO: do we need it?
        onAnimationEnd={fadeProps.onAnimationEnd}
      >
        {component ?? <DefaultLoadingSpinner />}
      </div>
    </>
  );
};
